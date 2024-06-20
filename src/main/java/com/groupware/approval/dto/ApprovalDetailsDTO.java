package com.groupware.approval.dto;

import lombok.Data;

import java.util.List;

@Data
public class ApprovalDetailsDTO {

    private ApprovalDTO approvalDTO;
    private List<ApprovalPathDTO> approvalPaths;
    private List<ApprovalReferencesDTO> approvalReferences;
    private List<ApprovalConsensusDTO> approvalConsensuses;
}
