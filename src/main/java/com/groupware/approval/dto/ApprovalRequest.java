package com.groupware.approval.dto;

import lombok.Data;

import java.util.List;

@Data
public class ApprovalRequest {

    private ApprovalDTO approvalDTO;
    private List<String> approvalPath;
    private List<String> approvalReferences;
    private List<String> approvalConsensus;
}
