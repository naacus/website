package org.naacus.config;

import com.microsoft.aad.msal4j.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Collections;
import java.util.Set;
import java.util.concurrent.CompletableFuture;

/**
 * Configuration for Microsoft Dataverse connection.
 * Uses Azure AD Client Credentials flow for authentication.
 */
@Configuration
public class DataverseConfig {

    @Value("${dataverse.environment-url}")
    private String environmentUrl;

    @Value("${azure.client-id}")
    private String clientId;

    @Value("${azure.client-secret}")
    private String clientSecret;

    @Value("${azure.tenant-id}")
    private String tenantId;

    private IConfidentialClientApplication confidentialClientApp;
    private String cachedToken;
    private long tokenExpiryTime;

    @Bean
    public WebClient dataverseWebClient() {
        return WebClient.builder()
                .baseUrl(environmentUrl + "/api/data/v9.2")
                .defaultHeader("OData-MaxVersion", "4.0")
                .defaultHeader("OData-Version", "4.0")
                .defaultHeader("Accept", "application/json")
                .defaultHeader("Content-Type", "application/json; charset=utf-8")
                .defaultHeader("Prefer", "return=representation")
                .build();
    }

    /**
     * Get access token for Dataverse API calls.
     * Caches token until near expiry.
     */
    public String getAccessToken() throws Exception {
        // Return cached token if still valid (with 5 min buffer)
        if (cachedToken != null && System.currentTimeMillis() < tokenExpiryTime - 300000) {
            return cachedToken;
        }

        if (confidentialClientApp == null) {
            confidentialClientApp = ConfidentialClientApplication.builder(
                    clientId,
                    ClientCredentialFactory.createFromSecret(clientSecret))
                    .authority("https://login.microsoftonline.com/" + tenantId)
                    .build();
        }

        Set<String> scopes = Collections.singleton(environmentUrl + "/.default");

        ClientCredentialParameters parameters = ClientCredentialParameters.builder(scopes).build();

        CompletableFuture<IAuthenticationResult> future = confidentialClientApp.acquireToken(parameters);
        IAuthenticationResult result = future.get();

        cachedToken = result.accessToken();
        tokenExpiryTime = result.expiresOnDate().getTime();

        return cachedToken;
    }

    public String getEnvironmentUrl() {
        return environmentUrl;
    }
}
