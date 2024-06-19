import { Schema, model } from 'mongoose';

const SearchPharmacySchema = new Schema(
  {
    name: {               // 약국 이름
      type: String,
      required :true
    },
    telephone: {    // 전화번호
      type: String,
      default: null
    },
    address: {            // 약국 주소(도로명)
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

export const SearchPharmacy = model('searchPharmacy', SearchPharmacySchema)