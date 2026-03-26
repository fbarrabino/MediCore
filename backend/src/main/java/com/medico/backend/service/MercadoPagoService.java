package com.medico.backend.service;

import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Collections;

@Service
public class MercadoPagoService {

    public String createPreference(String planName) throws MPException, MPApiException {
        BigDecimal price = BigDecimal.ZERO;
        String title = "Suscripción MediCore - Plan " + planName;

        if ("BASICO".equalsIgnoreCase(planName)) {
            price = new BigDecimal("15000");
        } else if ("PREMIUM".equalsIgnoreCase(planName)) {
            price = new BigDecimal("25000");
        } else {
            throw new IllegalArgumentException("Plan no válido: " + planName);
        }

        PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                .title(title)
                .quantity(1)
                .currencyId("ARS")
                .unitPrice(price)
                .build();

        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                .success("http://localhost:5173/panel/suscripcion")
                .pending("http://localhost:5173/panel/suscripcion")
                .failure("http://localhost:5173/panel/suscripcion")
                .build();

        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                .items(Collections.singletonList(itemRequest))
                .backUrls(backUrls)
                .autoReturn("approved")
                .build();

        PreferenceClient client = new PreferenceClient();
        Preference preference = client.create(preferenceRequest);

        return preference.getSandboxInitPoint(); 
    }
}
