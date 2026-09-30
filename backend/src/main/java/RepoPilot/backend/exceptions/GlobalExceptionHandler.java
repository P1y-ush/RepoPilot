package RepoPilot.backend.exceptions;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import java.util.Map;
import java.time.Instant;
import RepoPilot.backend.exceptions.GlobalExceptionHandler;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler (NotFoundException.class)
    ResponseEntity<Map<String,Object>> handleNotFoundException(NotFoundException ex){
        
        return error(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(BadRequestException.class)
    ResponseEntity<Map<String,Object>> handleBadRequestException(BadRequestException ex){
        return error(HttpStatus.BAD_REQUEST, ex.getMessage());
    
    }
    
    @ExceptionHandler (UnauthorizedException.class)
    ResponseEntity<Map<String,Object>> handleUnauthorizedException(UnauthorizedException ex){
        return error(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<Map<String,Object>> handleValidation(MethodArgumentNotValidException ex){
        String message = ex.getBindingResult().getFieldErrors().stream().findFirst().map(err->err.getField() + " " + err.getDefaultMessage()).orElse("Validation failed");
        return error(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(org.springframework.web.servlet.resource.NoResourceFoundException.class)
    ResponseEntity<Map<String,Object>> handleNoResourceFound(org.springframework.web.servlet.resource.NoResourceFoundException ex){
        return error(HttpStatus.NOT_FOUND, "Resource not found: " + ex.getResourcePath());
    }

    @ExceptionHandler(org.springframework.web.server.ResponseStatusException.class)
    ResponseEntity<Map<String,Object>> handleResponseStatus(org.springframework.web.server.ResponseStatusException ex){
        return error(HttpStatus.valueOf(ex.getStatusCode().value()), ex.getReason() != null ? ex.getReason() : ex.getMessage());
    }

    @ExceptionHandler (Exception.class)
    ResponseEntity<Map<String,Object>> handleException(Exception ex){
        return error(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage() !=null? ex.getMessage(): "Unexpected error occurred");
    }

    private ResponseEntity<Map<String,Object>> error(HttpStatus status, String message){
        return ResponseEntity.status(status).body(Map.of(
            "status", status.value(),
            "error", status.getReasonPhrase(),
            "message", message,
            "timestamp", Instant.now().toString()
        ));
    }
    
}
