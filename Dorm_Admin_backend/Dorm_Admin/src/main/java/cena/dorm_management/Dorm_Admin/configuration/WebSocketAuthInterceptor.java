package cena.dorm_management.Dorm_Admin.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

import java.util.List;

@RequiredArgsConstructor
@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtDecoder jwtDecoder;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String token = accessor.getFirstNativeHeader("Authorization");

            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
                try {
                    Jwt jwt = jwtDecoder.decode(token);
                    String role = jwt.getClaimAsString("role");
                    String username = jwt.getSubject();

                    List<SimpleGrantedAuthority> authorities =
                            List.of(new SimpleGrantedAuthority("ROLE_" + role));

                    Authentication auth = new UsernamePasswordAuthenticationToken(
                            username, null, authorities);

                    accessor.setUser(auth);

                    System.out.println("✅ Authenticated user in WebSocket: " + username);
                } catch (JwtException e) {
                    System.err.println("❌ Invalid JWT: " + e.getMessage());
                    throw new IllegalArgumentException("Token không hợp lệ");
                }
            } else {
                System.err.println("❗ Missing or malformed Authorization header");
            }
        }
        return message;
    }
}

