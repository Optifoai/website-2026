import React, { useEffect, useReducer } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { EMPTY_ARRAY, EMPTY_OBJECT, notify } from '../../utils/helpers';

import { getBrandList, uploadBackground } from '../../Redux/Actions/carAction';
import { useAuth } from '../../context/AuthContext';
import LoaderSpiner from '../../hooks/LoaderSpiner';
import { useTranslation } from 'react-i18next';
import { FolderIcon } from '../../components/common/model/svg'

function Brand(props) {
  const { t } = useTranslation();
  const { user, getUserData } = useAuth();
  const { dispatch, navigate, isUserLogin, Link } = props
  const [formdata, setFormdata] = useReducer((state, newState) => ({ ...state, ...newState }),
    {
      carsList: EMPTY_ARRAY,
      loader: false
    }
  );

  useEffect(() => {
    getBrandData();
    //   getUserData();
  }, EMPTY_ARRAY);  // FIXED

  const getBrandData = () => {
    setFormdata({ loader: true })
    dispatch(getBrandList()).then((res) => {
     
      if (res?.statusCode == '1') {
        let data = res?.responseData?.carsList
        setFormdata({ ...formdata, carsList: data,loader: false })
        // notify('success', res.response?.data?.message ? res.response?.data?.message : 'data fetched Successful.')
        // return true;
      } else {
         setFormdata({ loader: false })
        notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!')
      }
    }).catch((err) => {
      setFormdata({ loader: false })
      notify('error', err?.message ? err?.message : 'Something went wrong!')
    });

  };
  const { carsList } = formdata;
  return (
    <>

      {formdata?.loader ? <LoaderSpiner /> : <section class="card-block" aria-label="Preview Card">
       
          {carsList.map((items, i) => {
            return (
              <Link to={'/car/brand-details/' + items?.carBrand}  >

                <div className="car-folder-list">
                    <span className="">
                      <FolderIcon />
                    </span>
                    <h6 className="mb-0">{items?.carBrand}</h6>                
                </div>
              </Link>
            );
          })}
       

      </section>}
    </>
  );
}

Brand.propTypes = {
  dispatch: PropTypes.func,
  data: PropTypes.object,
  userDetails: EMPTY_OBJECT,

}

Brand.defaulProps = {
  dispatch: PropTypes.func,
  data: EMPTY_OBJECT,
  userDetails: EMPTY_OBJECT,

}

function mapStateToProps({ login }) {
  return {
    isUserLogin: login?.isUserLogin,
    userDetails: login?.userDetails,
  }
}

export default connect(mapStateToProps)(Brand)