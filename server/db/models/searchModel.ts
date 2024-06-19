import mongoose from "mongoose";
import { SearchHospital, checkSearchHospital } from "../schemas/searchHospital";
import { SearchPharmacy } from "../schemas/searchPharmacy";
import ValidationError from "../../utils/validationError";
import { pagination } from "../../utils/pagination";

export class SearchModel {
  // 전체 병원 조회
  async findAllHospitals(page: Number = 1, perPage: Number = 10) {
    const hospitals = await pagination(page, perPage, SearchHospital, {});
    return hospitals;
  }

  // 병원 검색
  async searchHospital(searchData: any, page: Number = 1, perPage: Number = 10) {
    const hospitals = await pagination(page, perPage, SearchHospital, searchData); // Like 검색 수행
    return hospitals
  }
 
  // 전체 약국 조회
  async findAllPharmacies(page: Number = 1, perPage: Number = 10) {
    const pharmacies = await pagination(page, perPage, SearchPharmacy, {});
    return pharmacies;
  }

  // 약국 검색
  async searchPharmacy(searchData: any, page: Number = 1, perPage: Number = 10) {
    const pharmacies = await pagination(page, perPage, SearchPharmacy, searchData); // Like 검색 수행
    return pharmacies
  }
}
const searchModel = new SearchModel()
export default searchModel 