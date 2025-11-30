import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { EMPTY_OBJECT } from '../../utils/helpers';

function BackgroundLogoPage(props) {

  return (
    <>
      <div class="bg-gradient">
        <h3 className='heading-title'>Background</h3>
        <p className='heading-subtitle'>Select the background type you want to apply on all your exterior images.</p>
      </div>
      <div className='bg-logo-blk'>
        <div class="card active">
          <img src="bg1.png" alt="Background 1" />
          <div class="bottom-row">

            <label class="radio-item">
              <input type="radio" name="lang" />
              <span class="custom-radio"></span>
              Active
            </label>

          </div>
        </div>


        <div class="card">
          <img src="bg2.png" alt="Background 2" />
          <div class="bottom-row">
            <label class="radio-item">
              <input type="radio" name="lang" />
              <span class="custom-radio"></span>

            </label>
            <button class="delete-btn"><img src='delete-icon.svg' /></button>
          </div>
        </div>


        <div class="card">
          <img src="bg3.png" alt="Background 3" />
          <div class="bottom-row">
            <label class="radio-item">
              <input type="radio" name="lang" />
              <span class="custom-radio"></span>

            </label>
            <button class="delete-btn"><img src='delete-icon.svg' /></button>
          </div>
        </div>


        <div class="card add-card">
          <div class="add-content">
            <div class="add-icon"><img src='add-icon.svg' /></div>
            <p>Add Background</p>
          </div>
        </div>
      </div>

      <div className='divider-1'></div>

      <div class="bg-gradient">
        <h3 className='heading-title'>Logo</h3>
        <p className='heading-subtitle'>Select the Logo you want to apply on all your exterior images.</p>
      </div>
        <div className='bg-logo-blk'>
        <div class="card active logo">
          <img src="logo1.png" alt="Logo 1" />
          <div class="bottom-row">

            <label class="radio-item">
              <input type="radio" name="logo" />
              <span class="custom-radio"></span>
              Active
            </label>

          </div>
        </div>


        <div class="card logo">
          <img src="logo2.png" alt="Logo 2" />
          <div class="bottom-row">
            <label class="radio-item">
              <input type="radio" name="logo" />
              <span class="custom-radio"></span>

            </label>
            <button class="delete-btn"><img src='delete-icon.svg' /></button>
          </div>
        </div>


        <div class="card logo">
          <img src="logo3.png" alt="Logo 3" />
          <div class="bottom-row">
            <label class="radio-item">
              <input type="radio" name="logo" />
              <span class="custom-radio"></span>

            </label>
            <button class="delete-btn"><img src='delete-icon.svg' /></button>
          </div>
        </div>


        <div class="card add-card">
          <div class="add-content">
            <div class="add-icon"><img src='add-icon.svg' /></div>
            <p>Add Logo</p>
          </div>
        </div>
      </div>
    </>
  );
}

BackgroundLogoPage.propTypes = {
  dispatch: PropTypes.func,
  data: PropTypes.object,
  loader: PropTypes.bool,
  userDetails: EMPTY_OBJECT,

}

BackgroundLogoPage.defaulProps = {
  dispatch: PropTypes.func,
  data: EMPTY_OBJECT,
  userDetails: EMPTY_OBJECT,
  loader: PropTypes.bool,

}

function mapStateToProps({ login }) {
  return {
    isUserLogin: login?.isUserLogin,
    userDetails: login?.userDetails,
  }
}

export default connect(mapStateToProps)(BackgroundLogoPage)