package cena.dorm_management.Dorm_Admin.service;

import cena.dorm_management.Dorm_Admin.dto.request.AuthenticationRequest;
import cena.dorm_management.Dorm_Admin.dto.request.IntrospectRequest;
import cena.dorm_management.Dorm_Admin.dto.response.AuthenticationResponse;
import cena.dorm_management.Dorm_Admin.dto.response.IntrospectResponse;

public interface AuthenticationService {
    AuthenticationResponse authenticate(AuthenticationRequest request);
    IntrospectResponse introspect(IntrospectRequest request) throws Exception;
}
