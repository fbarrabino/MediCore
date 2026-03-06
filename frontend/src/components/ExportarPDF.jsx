import { jsPDF } from 'jspdf';
import { obtenerHistorial } from '../services/evolucionService';
import { toast } from 'react-toastify';

export const imprimirHistoriaClinica = async (paciente) => {
  try {
    if (!paciente || !paciente.id) {
      toast.error("Error: Paciente no válido para imprimir.");
      return;
    }



    // Ya no necesitamos esperar al DOM ni tomarle foto a la pantalla
    const historial = await obtenerHistorial(paciente.id);
    const historialOrdenado = historial.sort((a, b) => new Date(b.fechaCarga) - new Date(a.fechaCarga));

    const doc = new jsPDF();
    const primaryColor = [30, 58, 138]; // blue-900
    const secondaryColor = [100, 116, 139]; // slate-500
    let yPos = 0;
    const pageHeight = doc.internal.pageSize.height;

    // --- ENCABEZADO ---
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(...primaryColor);
    doc.text("MediCore", 20, 28);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    doc.text(`Historia Clínica: ${paciente.nombre}`, 20, 34);
    doc.text(`Fecha de impresión: ${new Date().toLocaleDateString()}`, 190, 28, { align: 'right' });

    // --- DATOS DEL PACIENTE (Nativo y Vectorial) ---
    yPos = 50;

    // Caja de fondo
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.roundedRect(20, yPos, 170, 45, 3, 3, 'FD');

    // Nombre y DNI
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(paciente.nombre, 25, yPos + 10);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);
    doc.text(`DNI: ${paciente.dni}`, 25, yPos + 16);

    // Obra Social
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryColor);
    doc.text(paciente.obraSocial || 'PARTICULAR', 185, yPos + 10, { align: 'right' });

    // Detalles (Columnas)
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);

    // Columna 1
    doc.setFont("helvetica", "bold");
    doc.text("Dirección / Barrio:", 25, yPos + 26);
    doc.setFont("helvetica", "normal");
    doc.text(paciente.direccionBarrio || "-", 25, yPos + 31);

    // Columna 2
    doc.setFont("helvetica", "bold");
    doc.text("Edad:", 105, yPos + 26);
    doc.setFont("helvetica", "normal");
    doc.text(paciente.edad || "-", 105, yPos + 31);

    // Columna 3
    doc.setFont("helvetica", "bold");
    doc.text("Teléfono:", 155, yPos + 26);
    doc.setFont("helvetica", "normal");
    doc.text(paciente.telefono || "-", 155, yPos + 31);

    // Columna 1 - Fila 2
    doc.setFont("helvetica", "bold");
    doc.text("Alergias / Alertas:", 25, yPos + 38);
    doc.setFont("helvetica", "normal");
    if (paciente.alergiasAlertas) {
        doc.setTextColor(220, 38, 38); // Rojo
        doc.text(paciente.alergiasAlertas, 25, yPos + 43);
        doc.setTextColor(71, 85, 105); // Volver al gris
    } else {
        doc.text("Ninguna registrada", 25, yPos + 43);
    }

    // Columna 2 - Fila 2
    doc.setFont("helvetica", "bold");
    doc.text("Contacto Familiar:", 105, yPos + 38);
    doc.setFont("helvetica", "normal");
    doc.text(paciente.contactoFamiliar || "-", 105, yPos + 43);

    yPos += 60; // Mover el cursor para empezar las evoluciones

    // --- EVOLUCIONES ---
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text("Historial de Evoluciones Clínicas", 20, yPos);
    yPos += 10;

    if (historialOrdenado.length === 0) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(150, 150, 150);
      doc.text("No se registran evoluciones para este paciente.", 20, yPos);
    } else {
        historialOrdenado.forEach((item, index) => {
          
          if (yPos > pageHeight - 40) { doc.addPage(); yPos = 20; }

          if (index > 0) {
             doc.setDrawColor(226, 232, 240);
             doc.line(20, yPos - 6, 190, yPos - 6);
          }

          doc.setFontSize(9);
          doc.setTextColor(...secondaryColor);
          doc.setFont("helvetica", "bold");
          const fechaObj = new Date(item.fechaCarga);
          const fechaStr = `${fechaObj.toLocaleDateString()} - ${fechaObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
          doc.text(fechaStr, 20, yPos);

          yPos += 5;
          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "bold");
          doc.text(`Motivo: ${item.motivoConsulta || 'Consulta general'}`, 20, yPos);

          const agregarSeccion = (titulo, contenido) => {
            if (!contenido) return;
            yPos += 7;
            if (yPos > pageHeight - 30) { doc.addPage(); yPos = 20; }

            doc.setFontSize(9);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(50, 50, 50);
            doc.text(titulo, 20, yPos);
            
            yPos += 4;
            doc.setFont("helvetica", "normal");
            doc.setTextColor(80, 80, 80);
            const lineasTexto = doc.splitTextToSize(contenido, 170);
            doc.text(lineasTexto, 20, yPos);
            yPos += (lineasTexto.length * 4);
          };

          agregarSeccion("Enfermedad Actual:", item.antecedentesEnfermedadActual);
          agregarSeccion("Antecedentes Generales:", item.antecedentesGenerales);
          agregarSeccion("Estudios Complementarios:", item.estudiosComplementarios);
          
          if (item.diagnostico) {
             yPos += 6;
             if (yPos > pageHeight - 30) { doc.addPage(); yPos = 20; }
             
             const lineasDiag = doc.splitTextToSize(item.diagnostico, 166);
             const altoCaja = (lineasDiag.length * 4) + 8;
             
             doc.setFillColor(239, 246, 255);
             doc.setDrawColor(191, 219, 254);
             doc.roundedRect(20, yPos - 4, 170, altoCaja, 2, 2, 'FD');

             doc.setFontSize(9);
             doc.setFont("helvetica", "bold");
             doc.setTextColor(...primaryColor);
             doc.text("Diagnóstico:", 22, yPos);
             
             yPos += 5;
             doc.setFont("helvetica", "normal");
             doc.setTextColor(15, 23, 42);
             doc.text(lineasDiag, 22, yPos);
             
             yPos += (lineasDiag.length * 4) + 2; 
          }

          agregarSeccion("Indicaciones / Tratamiento:", item.indicaciones);
          yPos += 10; 
        });
    }

    // --- PIE DE PÁGINA ---
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.setFont("helvetica", "normal");
      doc.text(`Página ${i} de ${totalPages} - Documento generado por MediCore`, 105, pageHeight - 10, { align: 'center' });
    }

    doc.save(`Historia_Clinica_${paciente.nombre.replace(/\s+/g, '_')}_${paciente.dni}.pdf`);


  } catch (error) {
    console.error("Error detallado al generar PDF:", error);
    toast.error("Ocurrió un error al generar el PDF.");
  }
};