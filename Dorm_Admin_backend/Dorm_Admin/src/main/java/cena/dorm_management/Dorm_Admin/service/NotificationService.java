package cena.dorm_management.Dorm_Admin.service;

import cena.dorm_management.Dorm_Admin.dto.request.NotificationRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.NotificationResponseDto;
import cena.dorm_management.Dorm_Admin.dto.response.PagedResponse;
import org.springframework.data.domain.Pageable;

public interface NotificationService {
    NotificationResponseDto create(NotificationRequestDto dto);
    PagedResponse<NotificationResponseDto> getNotificationsForStudent(String username, Pageable pageable);
    void markAsRead(Long id, String username);
    PagedResponse<NotificationResponseDto> getAllNotifications(String loai, String trangThai, Pageable pageable);
    void deleteNotification(Long id);
    void sendToUser(String username, NotificationResponseDto dto);
    void broadcast(NotificationResponseDto dto);
}
