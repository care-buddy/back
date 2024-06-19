import { Request, Response } from 'express';
import mongoose, { Schema } from 'mongoose';
import searchService from '../services/searchServices';
import { SearchHospital, checkSearchHospital } from "../db/schemas/searchHospital";

class SearchController {
  // 전체 병원 조회
  async getAllHospitals(req: Request, res: Response) {
    try {
      const page = Number(req.query.page || 1)
      const perPage = Number(req.query.perPage || 10);

      const hospitals = await searchService.getAllHospitals(page, perPage);

      res.status(200).json({ success: true, message: hospitals });
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  }

  // 병원 검색
  async searchHospital(req: Request, res: Response) {
    try {
      const { address } = req.query; // address1 = "서울", address2 = "영등포구", search = "일곡"
      const page = Number(req.query.page || 1)
      const perPage = Number(req.query.perPage || 10);
      
      const hospitals = await searchService.searchHospital(address, page, perPage); // Like 검색 수행

      res.status(200).json({ success: true, hospitals });
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  }

  // 전체 약국 조회
  async getAllPharmacies(req: Request, res: Response) {
    try {
      const page = Number(req.query.page || 1)
      const perPage = Number(req.query.perPage || 10);

      const pharmacies = await searchService.getAllPharmacies(page, perPage);

      res.status(200).json({ success: true, message: pharmacies });
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  }

  // 약국 검색
  async searchPharmacy(req: Request, res: Response) {
    try {
      const { address } = req.query; // address = "서울"
      const page = Number(req.query.page || 1)
      const perPage = Number(req.query.perPage || 10);
      
      const pharmacies = await searchService.searchPharmacy(address, page, perPage); // Like 검색 수행

      res.status(200).json({ success: true, pharmacies });
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  }
}

const searchController = new SearchController();
export default searchController;