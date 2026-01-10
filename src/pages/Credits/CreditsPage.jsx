import React, { useEffect, useReducer, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../utils/helpers';
import { useTranslation } from 'react-i18next';

function CreditsPage(props) {
const { t } = useTranslation();


    const [isDenmark, setIsDenmark] = useState(false);

    useEffect(() => {
        // Get the browser's preferred language(s)
        const browserLocale = navigator.language || navigator.languages[0];
    
        // Validate if the user is from Denmark or speaks Danish
        const isDanish = browserLocale.startsWith('da'); // checks for 'da' (Danish)
        const isFromDenmark = browserLocale.endsWith('DK'); // checks for 'DK' (Denmark)
    
        // Set state based on validation
        if (isDanish && isFromDenmark) {
          setIsDenmark(true);
        }

    }, []);
    
    function getPaymentLink(isDenmark) {
        if (isDenmark) {
          return 'https://buy.stripe.com/00gcPxbqM2ua5Pi7su?locale=da'; // Danish payment link
        }
        return 'https://buy.stripe.com/28o02LamI3ye3Ha147'; // Default payment link
    }

    function getUnlimitedPackLink(isDenmark) {
        if (isDenmark) {
          return 'https://buy.stripe.com/9AQcPx7aw5Gm4LebIN?locale=da'; // Danish payment link
        }
        return 'https://buy.stripe.com/fZecPxamI6Kq3Ha9AE'; // Default payment link
    };


  return (
    <>


      <div class="bg-gradient">
        <h3 className='heading-title'>Credit Packs</h3>
        <p className='heading-subtitle'>Select the credit pack that gives your dealer the most value..</p>
      </div>
      <section class="card-block-credit" aria-label="Preview Card">
        <div class="pricing-card">
          <div class="price-section">
            <h2 class="price">€89</h2>
            <p class="subtext"> per transaction</p>
          </div>

          <div class="divider"></div>

          <div class="credits-section">
            <h3 class="credit">500 </h3>
            <p class="credits-label">{t('credits_text')}</p>
          </div>

          {/* <p class="tax-note">All prices are exclusive tax.</p> */}

          <button class="buy-btn"  onClick={() => window.location.href = getPaymentLink(isDenmark)} >{t('subscribe_text')}</button>
        </div>

        <div class="pricing-card">
          <div class="price-section">
            <h2 class="price">€129</h2>
            <p class="subtext"> per transaction</p>
          </div>

          <div class="divider"></div>

          <div class="credits-section">
            <h3 class="credit">Unlimited</h3>
            <p class="credits-label">{t('credits_text')}</p>
          </div>

          {/* <p class="tax-note">All prices are exclusive tax.</p> */}

          <button class="buy-btn" onClick={() => window.location.href = getUnlimitedPackLink(isDenmark)}>{t('subscribe_text')}</button>
        </div>

        {/* <div class="pricing-card">
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
        </div> */}

      </section>


      {/* <div class="auto-refill-card">
        <div class="text-group">
          <h3>Automatic Refill</h3>
          <p>Never run out of credits with automatic refills. Optifo will refill with recent bought pack.</p>
        </div>

        <label class="switch">
          <input type="checkbox" />
          <span class="slider"></span>
        </label>
      </div> */}




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