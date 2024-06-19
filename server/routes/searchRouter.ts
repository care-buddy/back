import { Router } from "express";
import searchController from "../controller/searchController";

const searchRouter = Router();

searchRouter.get("/AllH", searchController.getAllHospitals);
searchRouter.get("/hospitals", searchController.searchHospital);
searchRouter.get("/AllP", searchController.getAllPharmacies);
searchRouter.get("/pharmacies", searchController.searchPharmacy)

export default searchRouter;
