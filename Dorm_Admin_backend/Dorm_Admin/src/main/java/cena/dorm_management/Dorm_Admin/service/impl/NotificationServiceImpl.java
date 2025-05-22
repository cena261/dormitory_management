package cena.dorm_management.Dorm_Admin.service.impl;

import cena.dorm_management.Dorm_Admin.dto.request.NotificationRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.NotificationResponseDto;
import cena.dorm_management.Dorm_Admin.dto.response.PagedResponse;
import cena.dorm_management.Dorm_Admin.entity.Administrator;
import cena.dorm_management.Dorm_Admin.entity.Notification;
import cena.dorm_management.Dorm_Admin.entity.Student;
import cena.dorm_management.Dorm_Admin.exception.AppException;
import cena.dorm_management.Dorm_Admin.exception.ErrorCode;
import cena.dorm_management.Dorm_Admin.mapper.NotificationMapper;
import cena.dorm_management.Dorm_Admin.repository.AdministratorRepository;
import cena.dorm_management.Dorm_Admin.repository.NotificationRepository;
import cena.dorm_management.Dorm_Admin.repository.StudentRepository;
import cena.dorm_management.Dorm_Admin.service.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationServiceImpl implements NotificationService {

    NotificationRepository repository;
    StudentRepository studentRepository;
    AdministratorRepository adminRepository;
    NotificationMapper mapper;
    SimpMessagingTemplate messagingTemplate;

    @Override
    public void sendToUser(String username, NotificationResponseDto dto) {
        messagingTemplate.convertAndSendToUser(username, "/queue/notifications", dto);
    }

    @Override
    public void broadcast(NotificationResponseDto dto) {
        messagingTemplate.convertAndSend("/topic/notifications", dto);
    }

    @Override
    public NotificationResponseDto create(NotificationRequestDto dto) {
        Notification notification = mapper.toEntity(dto);

        notification.setThoiGianGui(LocalDateTime.now());
        notification.setTrangThai(Notification.TrangThai.CHUA_DOC);
        notification.setLoai(Notification.LoaiThongBao.valueOf(dto.getLoai()));

        Administrator admin = adminRepository.findById(dto.getMaQLGui())
                .orElseThrow(() -> new AppException(ErrorCode.ADMIN_NOT_FOUND));
        notification.setNguoiGui(admin);

        if (dto.getMaSV() != null) {
            Student student = studentRepository.findById(dto.getMaSV())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            notification.setNguoiNhan(student);
            repository.save(notification);
        } else {
            List<Student> students = studentRepository.findAll();
            students.forEach(s -> {
                Notification clone = mapper.toEntity(dto);
                clone.setThoiGianGui(LocalDateTime.now());
                clone.setTrangThai(Notification.TrangThai.CHUA_DOC);
                clone.setLoai(Notification.LoaiThongBao.valueOf(dto.getLoai()));
                clone.setNguoiGui(admin);
                clone.setNguoiNhan(s);
                repository.save(clone);
            });
            return null;
        }

        return mapper.toDto(notification);
    }

    @Override
    public PagedResponse<NotificationResponseDto> getNotificationsForStudent(String username, Pageable pageable) {
        Page<Notification> page = repository.findByNguoiNhan_Account_TaiKhoan(username, pageable);

        return PagedResponse.<NotificationResponseDto>builder()
                .content(page.getContent().stream().map(mapper::toDto).toList())
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Override
    public void markAsRead(Long id, String username) {
        Notification notification = repository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));

        if (!notification.getNguoiNhan().getAccount().getTaiKhoan().equals(username)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        notification.setTrangThai(Notification.TrangThai.DA_DOC);
        repository.save(notification);
    }

    @Override
    public PagedResponse<NotificationResponseDto> getAllNotifications(String loai, String trangThai, Pageable pageable) {
        Notification.LoaiThongBao parsedLoai = null;
        Notification.TrangThai parsedTrangThai = null;

        try {
            if (loai != null) parsedLoai = Notification.LoaiThongBao.valueOf(loai);
            if (trangThai != null) parsedTrangThai = Notification.TrangThai.valueOf(trangThai);
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_KEY);
        }

        Page<Notification> page = repository.filterNotifications(parsedLoai, parsedTrangThai, pageable);

        return PagedResponse.<NotificationResponseDto>builder()
                .content(page.getContent().stream().map(mapper::toDto).toList())
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Override
    public void deleteNotification(Long id) {
        if (!repository.existsById(id)) {
            throw new AppException(ErrorCode.NOTIFICATION_NOT_FOUND);
        }
        repository.deleteById(id);
    }

}

