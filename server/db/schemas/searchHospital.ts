import { Schema, model } from 'mongoose';

export interface checkSearchHospital {
  _id?: Schema.Types.ObjectId; // mongoDB 자동 생성되는 것 오버라이딩
  name?: string | null;
  telephone?: string | null;
  address?: string | null;
  zipCode?: string | null;
}

const SearchHospitalSchema = new Schema(
  {
    name: {               // 병원 이름
      type: String,
      required :true
    },
    telephone: {    // 전화번호
      type: String,
      default: null
    },
    address: {            // 병원 주소(도로명)
      type: String,
      default: null
    },
    zipCode: {            // 우편번호
      type: String,
      default: null
    }
  },
  {
    versionKey: false
  }
);

export const SearchHospital = model('searchHospital', SearchHospitalSchema)