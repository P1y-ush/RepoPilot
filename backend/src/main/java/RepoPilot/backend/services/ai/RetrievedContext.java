package RepoPilot.backend.services.ai;

import java.util.List;

import RepoPilot.backend.dto.CitationDto;

public record RetrievedContext(
        List<CitationDto> citations,
        String contextText) {
}
