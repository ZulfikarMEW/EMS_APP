import { MasterBudgetType } from "../../masters/budget-type/MasterBudgetType";
import { MasterDepartment } from "../../masters/department/Department";
import { MasterDesignation } from "../../masters/designation/MasterDesignation";
import { MasterFunctionalGroup } from "../../masters/functional-group/MasterFunctionalGroup";
import { Gender } from "../../masters/gender/Gender";
import { MasterGrade } from "../../masters/grade/MasterGrade";
import { MasterJobDegree } from "../../masters/job-degree/MasterJobDegree";
import { MasterJobDescription } from "../../masters/job-description/MasterJobDescription";
import { MasterJobLevel } from "../../masters/job-level/MasterJobLevel";
import { MasterJobTitle } from "../../masters/job-title/MasterJobTitle";
import { MasterNationality } from "../../masters/nationality/MasterNationality";
import { MasterReasonForPromotion } from "../../masters/reason-for-promotion/MasterReasonForPromotion";
import { MasterReasonForRetirement } from "../../masters/reason-for-retirement/MasterReasonForRetirement";
import { MasterWorkPlace } from "../../masters/work-places/MasterWorkPlace";

export class MasterDataList {
  departmentList: MasterDepartment[] = [];
  functionalGroupList: MasterFunctionalGroup[] = [];
  jobTitleList: MasterJobTitle[] = [];
  jobLevelList: MasterJobLevel[] = [];
  jobDescriptionList: MasterJobDescription[] = [];
  designationList: MasterDesignation[] = [];
  jobDegreeList: MasterJobDegree[] = [];
  gradeList: MasterGrade[] = [];
  budgetTypeList: MasterBudgetType[] = [];
  reasonForRetirementList: MasterReasonForRetirement[] = [];
  reasonForPromotionList: MasterReasonForPromotion[] = [];
  nationalityList: MasterNationality[] = [];
  genderList: Gender[] = [];
  workPlaceList: MasterWorkPlace[] = [];
}
