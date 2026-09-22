package RepoAnalyzer.backend.services.ai;

import java.util.List;

import RepoAnalyzer.backend.dto.CitationDto;

public record RetrievedContext(
        List<CitationDto> citations,
        String contextText) {
}
