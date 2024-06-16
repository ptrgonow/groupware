package com.groupware.approval.service;

import com.groupware.approval.dto.*;
import com.groupware.approval.mapper.ApMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class ApService {

    private final ApMapper apMapper;

    public List<EmployeeDTO> getEmployeeList() {
        return apMapper.selectAll();
    }

    public List<DeptTreeDTO> getDeptList() {
        return apMapper.selectAllDepartment();
    }

    public List<PositionsDTO> getPositionList() {
        return apMapper.selectAllPositions();
    }

    public List<DocNoDTO> getDocNo() {
        return apMapper.selectAllDocNo();
    }

    public List<ApprovalDTO> getMySubmittedApprovals(String employeeCode) {
        return apMapper.selectMySubmittedApprovals(employeeCode);
    }

    public List<ApprovalDTO> getMyPendingApprovals(String employeeCode) {
        return apMapper.selectMyPendingApprovals(employeeCode);
    }

    @Transactional
    public void createApproval(ApprovalDTO approvalDTO, List<String> approvalPath, List<String> approvalReferences, List<String> approvalConsensus) {
        approvalDTO.setStatus("미결");
        apMapper.insertApproval(approvalDTO);

        int approvalId = approvalDTO.getApprovalId();
        String fileCd = approvalDTO.getFileCd();

        for (int i = 0; i < approvalPath.size(); i++) {
            ApprovalPathDTO pathDTO = new ApprovalPathDTO();
            pathDTO.setApprovalId(approvalId);
            pathDTO.setEmployeeCode(approvalPath.get(i));
            pathDTO.setSequence(i + 1);
            pathDTO.setStatus("미결");
            pathDTO.setFileCd(fileCd);
            apMapper.insertApprovalPath(pathDTO);
        }

        for (String ref : approvalReferences) {
            ApprovalReferencesDTO refDTO = new ApprovalReferencesDTO();
            refDTO.setApprovalId(approvalId);
            refDTO.setEmployeeCode(ref);
            apMapper.insertApprovalReferences(refDTO);
        }

        for (String consensus : approvalConsensus) {
            ApprovalConsensusDTO consensusDTO = new ApprovalConsensusDTO();
            consensusDTO.setApprovalId(approvalId);
            consensusDTO.setEmployeeCode(consensus);
            consensusDTO.setStatus("미결");
            apMapper.insertApprovalConsensus(consensusDTO);
        }
    }

    @Transactional
    public void updateApprovalStatus(int approvalId, String employeeCode, String newStatus) {
        ApprovalPathDTO currentPath = apMapper.getApprovalPathByApprovalIdAndEmployeeCode(approvalId, employeeCode);
        if (currentPath == null) return;

        currentPath.setStatus(newStatus);
        apMapper.updateApprovalPathStatus(currentPath);

        if (newStatus.equals("완결")) {
            apMapper.updateApprovalStatus(approvalId, "완결");
        } else if (newStatus.equals("선결")) {
            List<ApprovalPathDTO> nextPaths = apMapper.getNextApprovalPaths(approvalId, currentPath.getSequence());
            for (ApprovalPathDTO nextPath : nextPaths) {
                nextPath.setStatus("후열");
                apMapper.updateApprovalPathStatus(nextPath);
            }
        }
    }

    @Transactional
    public void updateConsensusStatus(int approvalId, String employeeCode, String newStatus) {
        ApprovalConsensusDTO currentConsensus = apMapper.getApprovalConsensusByApprovalIdAndEmployeeCode(approvalId, employeeCode);
        if (currentConsensus == null) return;

        currentConsensus.setStatus(newStatus);
        apMapper.updateApprovalConsensusStatus(currentConsensus);

        if (newStatus.equals("완결")) {
            List<ApprovalConsensusDTO> nextConsensuses = apMapper.getNextApprovalConsensuses(approvalId, currentConsensus.getConsensusId());
            for (ApprovalConsensusDTO nextConsensus : nextConsensuses) {
                nextConsensus.setStatus("후열");
                apMapper.updateApprovalConsensusStatus(nextConsensus);
            }
        }
    }

    public List<ApprovalDTO> selectMyConsensusApprovals(String employeeCode) {
        return apMapper.selectMyConsensusApprovals(employeeCode);
    }

    public List<ApprovalDTO> selectMyCompletedApprovals(String employeeCode) {
        return apMapper.selectMyCompletedApprovals(employeeCode);
    }
}
