package cena.dorm_management.Dorm_Admin.service;

import cena.dorm_management.Dorm_Admin.dto.response.StudentResponseDto;

public interface StudentService {
    StudentResponseDto getCurrentStudent(String username);
}
