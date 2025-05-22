package cena.dorm_management.Dorm_Admin.mapper;

import cena.dorm_management.Dorm_Admin.dto.response.StudentResponseDto;
import cena.dorm_management.Dorm_Admin.entity.Student;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StudentMapper {
    StudentResponseDto toStudentResponse(Student student);
}
