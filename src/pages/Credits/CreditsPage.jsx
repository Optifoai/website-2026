import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { EMPTY_OBJECT } from '../../utils/helpers';

function CreditsPage(props) {

  return (
    <>

      <div class="bg-gradient">
        <h3 className='heading-title'>Credit Packs</h3>
        <p className='heading-subtitle'>Select the credit pack that gives your dealer the most value..</p>
      </div>
      <section class="card-block" aria-label="Preview Card">
        <div class="pricing-card">
          <div class="price-section">
            <h2 class="price">399<span class="currency">/kr.</span></h2>
            <p class="subtext">3.99 kr. / Credit</p>
          </div>

          <div class="divider"></div>

          <div class="credits-section">
            <h3 class="credit">100</h3>
            <p class="credits-label">CREDITS</p>
          </div>

          <p class="tax-note">All prices are exclusive tax.</p>

          <button class="buy-btn">Buy Pack</button>
        </div>
        <div class="pricing-card">
          <div class="price-section">
            <h2 class="price">399<span class="currency">/kr.</span></h2>
            <p class="subtext">3.99 kr. / Credit</p>
          </div>

          <div class="divider"></div>

          <div class="credits-section">
            <h3 class="credit">100</h3>
            <p class="credits-label">CREDITS</p>
          </div>

          <p class="tax-note">All prices are exclusive tax.</p>

          <button class="buy-btn">Buy Pack</button>
        </div>
        <div class="pricing-card">
          <div class="price-section">
            <h2 class="price">399<span class="currency">/kr.</span></h2>
            <p class="subtext">3.99 kr. / Credit</p>
          </div>

          <div class="divider"></div>

          <div class="credits-section">
            <h3 class="credit">100</h3>
            <p class="credits-label">CREDITS</p>
          </div>

          <p class="tax-note">All prices are exclusive tax.</p>

          <button class="buy-btn">Buy Pack</button>
        </div>

      </section>


      <div class="auto-refill-card">
        <div class="text-group">
          <h3>Automatic Refill</h3>
          <p>Never run out of credits with automatic refills. Optifo will refill with recent bought pack.</p>
        </div>

        <label class="switch">
          <input type="checkbox" />
          <span class="slider"></span>
        </label>
      </div>




    </>
  );
}

CreditsPage.propTypes = {
  dispatch: PropTypes.func,
  data: PropTypes.object,
  loader: PropTypes.bool,
  userDetails: EMPTY_OBJECT,

}

CreditsPage.defaulProps = {
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

export default connect(mapStateToProps)(CreditsPage)