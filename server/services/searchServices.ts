import mongoose from "mongoose";
import searchModel, { SearchModel } from "../db/models/searchModel";
import ValidationError from "../utils/validationError";

class SearchService {
  searchModel: SearchModel;

  constructor(searchModel: SearchModel) {
    this.searchModel = searchModel;
  }

  // 전체 병원 조회
  async getAllHospitals(page: Number, perPage: Number) {
    const hospitals = await this.searchModel.findAllHospitals(page, perPage);
    return hospitals;
  }

  // 병원 검색
  async searchHospital(address: any, page: Number, perPage: Number) {

    const regex = (pattern: any) => new RegExp(`.*${pattern}.*`);
    const addressRegex = regex(address); // .*서울.*

    const hospitals = await searchModel.searchHospital({ address: { $regex: addressRegex } }, page, perPage); // Like 검색 수행
    return hospitals
  }

  // 전체 약국 조회
  async getAllPharmacies(page: Number, perPage: Number) {
    const pharmacies = await this.searchModel.findAllPharmacies(page, perPage);
    return pharmacies;
  }

  // 약국 검색
  async searchPharmacy(address: any, page: Number, perPage: Number) {

    const regex = (pattern: any) => new RegExp(`.*${pattern}.*`);
    const addressRegex = regex(address); // .*서울.*

    const pharmacies = await searchModel.searchPharmacy({ address: { $regex: addressRegex } }, page, perPage); // Like 검색 수행
    return pharmacies
  }
}

const searchService = new SearchService(searchModel);
export default searchService;