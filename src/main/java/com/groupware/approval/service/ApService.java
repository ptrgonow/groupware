package com.groupware.approval.service;

import com.groupware.approval.dto.*;
import com.groupware.approval.mapper.ApMapper;
import com.groupware.user.dto.UserDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class ApService {

    private final ApMapper apMapper;


    // 사용자 결재선 여부 확인 로직 구현
    public boolean checkIfUserIsApprove(UserDTO user, List<ApprovalPathDTO> approvalPaths) {

        for (ApprovalPathDTO path : approvalPaths) {
            if (path.getEmployeeCode().equals(user.getEmployeeCode())) {
                return true;
            }
        }
        return false;
    }
    // 사용자 합의선 여부 확인 로직 구현
    public boolean checkIfUserIsConsensus(UserDTO user, List<ApprovalConsensusDTO> approvalConsensuses) {

        for (ApprovalConsensusDTO consensus : approvalConsensuses) {
            if (consensus.getEmployeeCode().equals(user.getEmployeeCode())) {
                return true;
            }
        }
        return false;
    }

    public boolean checkIfConsensusStatus(UserDTO user, List<ApprovalConsensusDTO> approvalConsensuses) {

            for (ApprovalConsensusDTO consensus : approvalConsensuses) {
                if (consensus.getEmployeeCode().equals(user.getEmployeeCode())) {
                    if (consensus.getStatus().equals("미결")) {
                        return true;
                    }
                }
            }
            return false;
    }

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

    public List<ApprovalDTO> selectMyConsensusApprovals(String employeeCode) {
        return apMapper.selectMyConsensusApprovals(employeeCode);
    }

    public List<ApprovalDTO> selectMyCompletedApprovals(String employeeCode) {
        return apMapper.selectMyCompletedApprovals(employeeCode);
    }

    public ApprovalDetailsDTO getApprovalDetail(int approvalId) {

        ApprovalDTO approval = apMapper.selectApprovalByApprovalId(approvalId);
        List<ApprovalPathDTO> paths = apMapper.selectApprovalPathsByApprovalId(approvalId);
        List<ApprovalConsensusDTO> consensuses = apMapper.selectApprovalConsensusesByApprovalId(approvalId);
        List<ApprovalReferencesDTO> references = apMapper.selectApprovalReferencesByApprovalId(approvalId);

        ApprovalDetailsDTO result = new ApprovalDetailsDTO();
        result.setApprovalDTO(approval);
        result.setApprovalPaths(paths);
        result.setApprovalConsensuses(consensuses);
        result.setApprovalReferences(references);

        return result;
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

        if (newStatus.equals("결재")) {
            // 현재 시퀀스보다 이전 시퀀스 중 결재가 완료되지 않은 경우 후열로 변경
            List<ApprovalPathDTO> previousPaths = apMapper.getPreviousApprovalPaths(approvalId, currentPath.getSequence());
            for (ApprovalPathDTO previousPath : previousPaths) {
                if (previousPath.getStatus().equals("미결")) {
                    previousPath.setStatus("후열");
                    apMapper.updateApprovalPathStatus(previousPath);
                }
            }
        }

        // 모든 시퀀스가 결재 완료되었는지 확인
        List<ApprovalPathDTO> paths = apMapper.selectApprovalPathsByApprovalId(approvalId);
        boolean allApproved = paths.stream().allMatch(path -> path.getStatus().equals("결재"));

        if (allApproved) {
            apMapper.updateApprovalStatus(approvalId, "완결");
        }
    }

    @Transactional
    public void updateConsensusStatus(int approvalId, String employeeCode, String newStatus) {
        ApprovalConsensusDTO currentConsensus = apMapper.getApprovalConsensusByApprovalIdAndEmployeeCode(approvalId, employeeCode);
        if (currentConsensus == null) return;

        currentConsensus.setStatus(newStatus);
        apMapper.updateApprovalConsensusStatus(currentConsensus);
    }

    @Transactional
    public void rejectApproval(int approvalId) {
        // 반려 테이블로 데이터 이동
        apMapper.insertRejectedApproval(approvalId);

        // 결재 테이블에서 데이터 삭제
        apMapper.deleteApproval(approvalId);

    }
}



