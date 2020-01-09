package br.jus.trt22.trt22backend.config;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * GlobalExceptionHandler
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({ ConstraintViolationException.class })
    public ResponseEntity<Map<String, String>> yourExceptionHandler(ConstraintViolationException e) {
        Map<String, String> errors = new HashMap<>();
        Set<ConstraintViolation<?>> constraintViolations = e.getConstraintViolations();
        for (ConstraintViolation<?> constraintViolation : constraintViolations) {
            errors.put(constraintViolation.getPropertyPath().toString(), constraintViolation.getMessage());
        }

        return new ResponseEntity<Map<String, String>>(errors, HttpStatus.PRECONDITION_FAILED);
    }
}