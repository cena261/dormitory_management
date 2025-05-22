package cena.dorm_management.Dorm_Admin.controller;

import cena.dorm_management.Dorm_Admin.dto.request.ApiResponse;
import cena.dorm_management.Dorm_Admin.dto.request.NotificationRequestDto;
import cena.dorm_management.Dorm_Admin.dto.response.NotificationResponseDto;
import cena.dorm_management.Dorm_Admin.dto.response.PagedResponse;
import cena.dorm_management.Dorm_Admin.service.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {

    NotificationService service;

    @PostMapping
    public ApiResponse<?> create(@RequestBody NotificationRequestDto dto) {
        NotificationResponseDto result = service.create(dto);

        if (dto.getMaSV() != null) {
            service.sendToUser(dto.getMaSV(), result);
        } else {
            service.broadcast(result);
        }

        return ApiResponse.builder()
                .message("Gửi thông báo thành công")
                .result(result)
                .build();
    }

    @GetMapping("/me")
    public ApiResponse<PagedResponse<NotificationResponseDto>> getMyNotifications(
            Principal principal,
            @PageableDefault(size = 10, sort = "thoiGianGui", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ApiResponse.<PagedResponse<NotificationResponseDto>>builder()
                .message("Danh sách thông báo của bạn")
                .result(service.getNotificationsForStudent(principal.getName(), pageable))
                .build();
    }

    @PutMapping("/{id}/read")
    public ApiResponse<?> markAsRead(@PathVariable Long id, Principal principal) {
        service.markAsRead(id, principal.getName());
        return ApiResponse.builder()
                .message("Đã đánh dấu đã đọc thông báo")
                .build();
    }

    @GetMapping
    public ApiResponse<PagedResponse<NotificationResponseDto>> getAll(
            @RequestParam(required = false) String loai,
            @RequestParam(required = false) String trangThai,
            @PageableDefault(size = 10, sort = "thoiGianGui", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ApiResponse.<PagedResponse<NotificationResponseDto>>builder()
                .message("Danh sách toàn bộ thông báo")
                .result(service.getAllNotifications(loai, trangThai, pageable))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable Long id) {
        service.deleteNotification(id);
        return ApiResponse.builder()
                .message("Thông báo đã được thu hồi / xóa")
                .build();
    }
}


