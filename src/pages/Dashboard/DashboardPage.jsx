import React, { useEffect, useReducer } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { displayDateFormat, EMPTY_ARRAY, EMPTY_OBJECT, getLocalStorage, notify, ResponseFilter, setLoginDetailInSession } from '../../utils/helpers';
import { getAllCarImages, getAllCarVideo, getCarDelete, getCarList } from '../../Redux/Actions/carAction';
import Spinner from '../../hooks/Spinner';
import CommonModel from '../../components/common/model/CommonModel';
import { useTranslation, Trans } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import LoaderSpiner from '../../hooks/LoaderSpiner';
import InfiniteScroll from 'react-infinite-scroll-component';
import { get } from 'jquery';



function DashboardPage(props) {
    const { t } = useTranslation();
    const { user, getUserData } = useAuth();
    const { dispatch, navigate, isUserLogin, loader, Link } = props
    const [formdata, setFormdata] = useReducer((state, newState) => ({ ...state, ...newState }),
        {
            carsList: EMPTY_ARRAY,
            downloadModelOpen: false,
            actionCarDetails: EMPTY_OBJECT,
            deleteModelOpen: false,
            videoModelOpen: false,
            editModelOpen: false,
            hasMore: true,
            activePage: 1,
            loader: false,
            visitModelOpen: false

        }
    );

    useEffect(() => {
        getCarData();

        let visit=getLocalStorage('visit')
        if(visit){
            setFormdata({ visitModelOpen: true });
        }else{
            setFormdata({ visitModelOpen: false });
        }
        setTimeout(() => {
             setFormdata({ visitModelOpen: false });
             localStorage.setItem('visit',false)
        }, 5000)

        //   getUserData();
    }, EMPTY_ARRAY);  // FIXED




    //get car list
    const getCarData = (page = '') => {
        const { carsList, activePage } = formdata
        activePage == '1' ? setFormdata({ loader: true }) : setFormdata({ loader: false })
        let params = { page: page ? page : activePage, limit: 20 }
        dispatch(getCarList(params)).then((res) => {
            setFormdata({ loader: false })
            // ResponseFilter(res);
            if (res?.statusCode == '1') {
                let carListData = res?.responseData?.carsList
                if (page === '1') {
                    setFormdata({ carsList: carListData, hasMore: true, activePage: 2, deleteModelOpen: false });
                } else if (carsList?.length >= res?.responseData?.totalRecords) {
                    setFormdata({ hasMore: false });
                } else {
                    let data = carsList?.concat(carListData)
                    setFormdata({ carsList: data, deleteModelOpen: false, activePage: activePage + 1 });
                }

                return true;
            } else {
                notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!')
            }
        }).catch((err) => {
            notify('error', err?.message ? err?.message : 'Something went wrong!')
        });

    };

    const actionDelteModal = () => {
        //  getCarData()
        let payLoad = {
            vehicleId: formdata?.actionCarDetails?._id,
        };
        dispatch(getCarDelete(payLoad)).then((res) => {
            if (res?.statusCode == '1') {

                notify('success', res.response?.data?.message ? res.response?.data?.message : 'Car deleted successful.')
                setFormdata({ deleteModelOpen: false, activePage: 1, carsList: [] });
                getCarData('1')
                // return true;
            } else {
                notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!')
            }
        }).catch((err) => {
            notify('error', err?.message ? err?.message : 'Something went wrong!')
        });
        setFormdata({ deleteModelOpen: false });
    }

    const actionDownloadModal = () => {
        let items = formdata?.actionCarDetails
        let links = [];
        for (let i = 0; i < items?.carImages?.length; i++) {
            links.push(items?.carImages[i]?.partUrl);
        }
        let payLoad = {
            imgArray: links,
            carBrand: items?.carBrand,
            carYear: items?.carYear,
            carModel: items?.carModel
        }


        dispatch(getAllCarImages(payLoad)).then((res) => {
            // ResponseFilter(res);
            if (res?.statusCode == '1') {
                const link = document.createElement('a');
                link.href = res?.responseData?.result;
                link.download = 'cars.zip';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link); // Clean up by removing the link
                notify('success', res.response?.data?.message ? res.response?.data?.message : 'Download Successful.')
                return true;
            } else {
                notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!')
            }
        }).catch((err) => {
            notify('error', err?.message ? err?.message : 'Something went wrong!')
        });
        setFormdata({ downloadModelOpen: false });
    }

    const actionVideoModal = () => {
        let items = formdata?.actionCarDetails
        let payLoad = {
            carVideo: items.aIVideoUrl,
            carBrand: items.carBrand,
            carModel: items.carModel,
        }


        dispatch(getAllCarVideo(payLoad)).then((res) => {
            // ResponseFilter(res);
            if (res?.statusCode == '1') {
                const link = document.createElement('a');
                link.href = items.aIVideoUrl
                link.download = items.aIVideoUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link); // Clean up by removing the link
                notify('success', res.response?.data?.message ? res.response?.data?.message : 'Download Successful.')
                return true;
            } else {
                notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!')
            }
        }).catch((err) => {
            notify('error', err?.message ? err?.message : 'Something went wrong!')
        });
        setFormdata({ videoModelOpen: false });
    }

    const CarForm = () => {
        return (<section class="card-block" aria-label="Preview Card">

            {formdata?.carsList?.length > 0 && formdata?.carsList?.map((items, index) => {
                return (
                    <div key={index} class="car-card dashboard-page" >

                        <div class="image-section">
                            <img class="card-image" src={items?.carImages?.[0]?.partUrl ? items?.carImages?.[0]?.partUrl : "/images/car-placeholder.png"} />

                            <div class="top-right-square" onClick={() => { setFormdata({ deleteModelOpen: true, actionCarDetails: items }); }}>
                                <img src='/images/trash.png' />
                            </div>
                        </div>

                        <div class="content-section" >
                            <Link to={`/car/${items._id}`}> <>
                                <h2 class="car-title">{items?.carModel}</h2>

                                <p class="car-metadata"> {items?.carYear}, {items?.carBrand}</p>

                                <p class="license-plate">{items?.carId}</p>
                            </> </Link>
                            <div class="date-download-blk">
                                <p class="date-time">{items?.created ? displayDateFormat(items?.created) : '-'}</p>

                                {/* <p class="date-time">06:00PM, 03 Mar 2021</p> */}

                                <div class="action-buttons">
                                    {items?.aIVideoUrl && <button class="icon-button video-icon" onClick={() => { setFormdata({ videoModelOpen: true, actionCarDetails: items }); }}>
                                        <img src="/images/video.svg" />
                                    </button>}

                                    <button class="icon-button download-icon" onClick={() => { setFormdata({ downloadModelOpen: true, actionCarDetails: items }); }}>
                                        <img src="/images/download.svg" />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                )
            })
            }

        </section>)
    }


    return (
        <>
            {formdata?.loader && !formdata?.visitModelOpen ? <LoaderSpiner /> :
                <div>


                    <InfiniteScroll
                        style={{ height: 'auto', overflow: 'hidden' }}
                        dataLength={formdata?.carsList.length}
                        pageStart={1}
                        next={getCarData}
                        hasMore={formdata.hasMore}
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                                <b>Yay! You have seen it all</b>
                            </p>
                        }
                        loader={
                            formdata?.carsList.length >= 20 ? (
                                <p className="text-center mb-0">Loading...</p>
                                // <h3 style={{ textAlign: 'center' ,color:'white'}}>&#8595; Pull down to more cars...</h3>
                            ) : (
                                ''
                            )
                        }
                    // refreshFunction={getCarData}
                    // pullDownToRefresh
                    // pullDownToRefreshThreshold={50}
                    // pullDownToRefreshContent={
                    //     <h3 style={{ textAlign: 'center' ,color:'white'}}>&#8595; Pull down to refresh</h3>
                    // }
                    // releaseToRefreshContent={
                    //     <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
                    // }
                    >
                        {CarForm()}
                    </InfiniteScroll>

                </div>
            }
            {/* car delete model */}
            <CommonModel show={formdata.deleteModelOpen} onClose={() => { setFormdata({ deleteModelOpen: false }) }}>
                <img src="/images/delete-image.png" />
                <h2>{t('deleteText')} {formdata?.actionCarDetails?.carModel} ?</h2>
                <p>
                    <Trans i18nKey="deleteCarMsgText">
                        Do you really want to delete this car from your Optifo list ?
                    </Trans>
                </p>
                <div className="popup-btn">
                    <button type="button" className="btn btn-login" onClick={actionDelteModal}>{t('deleteText')}</button>
                    <button type="button" className="btn btn-secondary" onClick={() => { setFormdata({ deleteModelOpen: false }); }}>{t('cancelText')}</button>
                </div>
            </CommonModel>
            {/* car image downlaod model */}
            <CommonModel show={formdata.downloadModelOpen} onClose={() => { setFormdata({ downloadModelOpen: false }) }}>

                <img src='/images/download-image.png' />
                <h2>Download Complete Set</h2>
                <p>Would you like to download all photos of the {`${formdata?.actionCarDetails?.carBrand} ${formdata?.actionCarDetails?.carModel}`} ?</p>
                <div className='popup-btn'>
                    <button type="button" class="btn btn-login" onClick={actionDownloadModal}>{t('DownloadAllText')}</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { setFormdata({ downloadModelOpen: false }); }}>{t('cancelText')}</button>
                </div>

            </CommonModel>

            {/* car video downlaod model */}
            <CommonModel show={formdata.videoModelOpen} onClose={() => { setFormdata({ videoModelOpen: false }) }}>

                <img src='/images/download-image.png' />
                <h2>Download Complete Set</h2>
                <p>Would you like to download video of the {`${formdata?.actionCarDetails?.carBrand} ${formdata?.actionCarDetails?.carModel}`} ?</p>
                <div className='popup-btn'>
                    <button type="button" class="btn btn-login" onClick={actionVideoModal}>{t('DownloadAllText')}</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { setFormdata({ videoModelOpen: false }); }}>{t('cancelText')}</button>
                </div>

            </CommonModel>

            {/* Default visit msg show */}
            <CommonModel show={formdata.visitModelOpen} custombg={'visitmodal'} onClose={() => { setFormdata({ visitModelOpen: false }) }}>
                <div className='visit-car-image'>
                    <img src='/images/visit-car.gif' />
                </div>
                <h2 className='mt-0'>Glad to have you at Optifo!</h2>
                <p>Start by choosing your background and adding your company logo on the right. When you're ready to capture photos, download the Optifo iOS app to begin.”</p>

            </CommonModel>







        </>
    );
}

DashboardPage.propTypes = {
    dispatch: PropTypes.func,
    data: PropTypes.object,
    loader: PropTypes.bool,
}

DashboardPage.defaulProps = {
    dispatch: PropTypes.func,
    data: EMPTY_OBJECT,
    loader: PropTypes.bool,

}

function mapStateToProps({ carReducer }) {
    return {
        loader: carReducer?.loader
    }
}

export default connect(mapStateToProps)(DashboardPage)
