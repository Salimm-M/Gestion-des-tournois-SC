package org.example.football.dto.match;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
@Data
public class PlanifierMatchDTO {
    private Long StadeId;
    private LocalDate dateMatch;
    private LocalTime heureDebut;
    private Long idMatch;
}
