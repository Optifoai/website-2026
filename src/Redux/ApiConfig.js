import { Config } from '../services/config'
let baseURL=Config?.serverAPIUrl
export const APICONFIG = {
	
	// Diamond parking api start 
	getUserLoginUrl: `${baseURL}user/login`,
	getUserProfileUrl: `${baseURL}user/userProfile`,
	getUserSignupUrl: `${baseURL}user/sendOtp`,
	getCarListUrl: `${baseURL}cars/view`,
	getCarDetailsUrl: `${baseURL}cars/viewOne`,
	getAllCarImageDownloadUrl: `${baseURL}cars/downloadCars`,
	getCarDeleteAPIUrl: `${baseURL}cars/delete`,
	getAllCarVideoDownloadUrl: `${baseURL}cars/downloadCarVideo`,
    CAR_UPDATE: `${baseURL}cars/update`,
    // USER_PROFILE_INFO_UPDATE: `${baseURL}user/update`,
    USER_PROFILE_INFO_UPDATE_EMAIL: `${baseURL}user/update`,

    USER_PROFILE_INFO_UPDATE: `${baseURL}user/updatev1`,

    SET_BACKGROUND: `${baseURL}backgrounds/setBackground`,
    DELETE_BACKGROUND: `${baseURL}backgrounds/deleteOne`,
    UPLOAD_BACKGROUND: `${baseURL}backgrounds/upload`,
    // CAR_BRANDS: `${baseURL}cars/viewMyFolders`,
    CAR_BRANDS: `${baseURL}cars/carBrands`,

	
    LOGOUT: `${baseURL}user/logout`,
    
    
    USER_STRIPE_PRICE: `${baseURL}user/stripePrices`,
    USER_CREDIT_PRICE: `${baseURL}credit/getCreditPlans`,

    CREATE_STRIPE_CUSTOMER: `${baseURL}user/createStripeCustomer`,
    GET_INVOICE: `${baseURL}/user/getSingleCharges`,
    UPDATE_SUBSCRIPTION: `${baseURL}user/updateSubscription`,
    CANCEL_SUBSCRIPTION: `${baseURL}user/cancelSubscription`,
    ADD_CARD: `${baseURL}user/addCard`,
    CREATE_SUBSCRIPTION: `${baseURL}user/createSubscription`,
    CREATE_CHARGE: `${baseURL}user/createCharge`,
    CREATE_AUTHENTICATED_CHARGE: `${baseURL}user/createChargeByAuthenticatedCard`,
    UPDATE_USER_CREDIT: `${baseURL}user/updateUserCredits`,
    UPDATE_THRESH_CREDIT: `${baseURL}user/updateThresholdCredit`,
    UPDATE_ACTIVE_LOGO: `${baseURL}user/updateLogoStatus`,
    UPDATE_COUPON: `${baseURL}user/updateUserCoupon`,
    UPDATE_USER_PACK_CREDIT: `${baseURL}user/updatePackUserCredits`,
    UPDATE_CARD: `${baseURL}user/updateCard`,
    
  
    GET_CARD: `${baseURL}user/getCard`,
    
    USER_INVOICES: `${baseURL}user/listInvoices`,
    USER_CHARGES_INVOICES: `${baseURL}user/listCharges`,
    
    GET_COUPONS: `${baseURL}coupons/getAllCoupon`,
    GET_COUPON_BY_ID: `${baseURL}coupons/getCouponById`,
    GET_ADDRESS: `${baseURL}address/getAddress`,
    GET_CURRENCY: `${baseURL}currency/getCurrency`,
   
    CAR_IMAGES_DELETE: `${baseURL}cars/deleteImages`,
    USER_DELETE_ACCOUNT: `${baseURL}user/delete`,
    REMOVE_CAR_IMAGE_BACKGROUND: `${baseURL}cars/uploadImageWithBgRemoval`,
    DELETE_CAR_Image: `${baseURL}backgrounds/deleteCarOne`,
    UPLOAD_CAR: `${baseURL}backgrounds/uploadCar`,
    CREAT_CAR: `${baseURL}cars/addcar`,
    CREAT_360CAR_IMAGE: `${baseURL}cars/generate360Images`,
    UPLOAD_CAR_VIDEO: `${baseURL}cars/uploadCarVideo`,
    // CREAT_AI_IMAGE: `${baseURL}cars/generate360Images1`,
    CREAT_AI_IMAGE: 'https://fastapi.optifo.in/generate-ai-video'



}




