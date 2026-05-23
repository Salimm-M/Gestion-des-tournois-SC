package org.example.football.dto.participation;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParticipationCreateDTO {
    private Long equipeId;
    private Long tournoiId;
}