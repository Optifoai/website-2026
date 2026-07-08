import React, { useEffect, useReducer } from 'react';

import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';

import LoaderSpiner from '../../hooks/LoaderSpiner';

import Button from '../common/Button/Button';

import FeatureCheckboxGroup from '../CarTemplate/FeatureCheckboxGroup';

import { notify } from '../../utils/helpers';

import { getTemplate, getGroupedFeatures } from '../../services/vendorCarTemplate.service';

import { updateCarDetails } from '../../Redux/Actions/carAction';



function mapFeatureIds(features = []) {

    return (features || []).map((featureId) => String(featureId));

}



function resolveFeatureNamesFromGroups(groupedFeatures, selectedFeatures) {

    const selectedSet = new Set(selectedFeatures.map(String));

    const names = [];



    groupedFeatures.forEach((category) => {

        (category.features || []).forEach((feature) => {

            if (selectedSet.has(String(feature._id))) {

                names.push(feature.name);

            }

        });

    });



    return names;

}



function buildCopyText(carDescription, mainDescription, featureNames) {

    const featuresLine = featureNames.length ? featureNames.join(', ') : '';



    return [

        'Car Description',

        '',

        carDescription || '',

        '',

        'Main Description',

        '',

        mainDescription || '',

        '',

        'Car Features',

        '',

        featuresLine

    ].join('\n');

}



function CarFeatureTab({ dispatch, vehicleId, carDetails, onSaved }) {

    const { t } = useTranslation();

    const [state, setState] = useReducer(

        (prev, next) => ({ ...prev, ...next }),

        {

            loader: true,

            saving: false,

            copying: false,

            carDescription: '',

            selectedFeatures: [],

            groupedFeatures: [],

            mainDescription: '',

            initialSnapshot: null

        }

    );



    const applyCarDetails = (details = {}) => {

        const snapshot = {

            carDescription: details.car_description || '',

            selectedFeatures: mapFeatureIds(details.selected_features)

        };



        setState({

            carDescription: snapshot.carDescription,

            selectedFeatures: snapshot.selectedFeatures,

            initialSnapshot: snapshot

        });

    };



    const loadTabData = async () => {

        setState({ loader: true });



        try {

            const [groupedRes, templateRes] = await Promise.all([

                getGroupedFeatures(),

                getTemplate()

            ]);



            if (groupedRes?.statusCode != 1) {

                notify('error', groupedRes?.error?.responseMessage || t('carTemplateFeaturesLoadError'));

                setState({ loader: false });

                return;

            }



            const template = templateRes?.statusCode == 1

                ? (templateRes?.responseData?.result || {})

                : {};



            applyCarDetails(carDetails);



            setState({

                loader: false,

                groupedFeatures: groupedRes?.responseData?.result || [],

                mainDescription: template.main_description || ''

            });

        } catch (error) {

            setState({ loader: false });

            notify('error', error?.error?.responseMessage || error?.responseMessage || t('carFeatureLoadError'));

        }

    };



    useEffect(() => {

        if (vehicleId) {

            loadTabData();

        }

    }, [vehicleId]);



    useEffect(() => {

        if (!state.loader && carDetails?._id) {

            applyCarDetails(carDetails);

        }

    }, [carDetails?._id, carDetails?.car_description, carDetails?.selected_features]);



    const handleToggleFeature = (featureId) => {

        setState({

            selectedFeatures: state.selectedFeatures.includes(featureId)

                ? state.selectedFeatures.filter((id) => id !== featureId)

                : [...state.selectedFeatures, featureId]

        });

    };



    const handleSave = async () => {

        setState({ saving: true });



        try {

            const payload = {

                vehicleId,

                car_description: state.carDescription,

                selected_features: state.selectedFeatures

            };



            const response = await dispatch(updateCarDetails(payload));



            if (response?.statusCode == 1) {

                const saved = response?.responseData || {};

                const snapshot = {

                    carDescription: saved.car_description || state.carDescription,

                    selectedFeatures: mapFeatureIds(saved.selected_features || state.selectedFeatures)

                };



                setState({

                    saving: false,

                    carDescription: snapshot.carDescription,

                    selectedFeatures: snapshot.selectedFeatures,

                    initialSnapshot: snapshot

                });



                notify('success', response?.responseData?.message || t('carFeatureSaveSuccess'));



                if (onSaved) {

                    onSaved();

                }

            } else {

                setState({ saving: false });

                notify('error', response?.error?.responseMessage || t('carFeatureSaveError'));

            }

        } catch (error) {

            setState({ saving: false });

            notify('error', error?.error?.responseMessage || error?.responseMessage || t('carFeatureSaveError'));

        }

    };



    const handleCopyDetails = async () => {

        const featureNames = resolveFeatureNamesFromGroups(

            state.groupedFeatures,

            state.selectedFeatures

        );



        const copyText = buildCopyText(

            state.carDescription,

            state.mainDescription,

            featureNames

        );



        setState({ copying: true });



        try {

            await navigator.clipboard.writeText(copyText);

            notify('success', t('copiedToClipboard'));

        } catch (error) {

            notify('error', t('carFeatureCopyError'));

        } finally {

            setState({ copying: false });

        }

    };



    if (state.loader) {

        return <LoaderSpiner />;

    }



    return (

        <div className="car-feature-tab car-template-page">

            <div className="car-feature-tab-header d-flex justify-content-between align-items-center mb-4">

                <h4 className="car-template-subtitle mb-0">{t('carFeatureTabTitle')}</h4>

                <Button

                    type="button"

                    className="btn btn-secondary"

                    disabled={state.copying}

                    onClick={handleCopyDetails}

                >

                    {t('carFeatureCopyDetails')}

                </Button>

            </div>



            <div className="car-template-section mb-4">

                <label className="form-label">{t('carTemplateCarDescription')}</label>

                <textarea

                    className="form-control car-template-textarea"

                    rows="4"

                    name="car_description"

                    value={state.carDescription}

                    onChange={(e) => setState({ carDescription: e.target.value })}

                    placeholder={t('carTemplateCarDescriptionPlaceholder')}

                />

            </div>



            <div className="car-template-section mb-4">

                <h4 className="car-template-subtitle mb-3">{t('carTemplateFeaturesTitle')}</h4>

                {state.groupedFeatures.length ? (

                    state.groupedFeatures.map((category) => (

                        <FeatureCheckboxGroup

                            key={String(category._id)}

                            category={category}

                            selectedFeatures={state.selectedFeatures}

                            onToggleFeature={handleToggleFeature}

                        />

                    ))

                ) : (

                    <p className="car-template-muted">{t('carTemplateNoFeatures')}</p>

                )}

            </div>



            <div className="car-template-actions d-flex gap-3">

                <Button

                    type="button"

                    className="btn btn-primary"

                    disabled={state.saving}

                    onClick={handleSave}

                >

                    {state.saving ? t('SavingText') : t('SaveText')}

                </Button>

            </div>

        </div>

    );

}



CarFeatureTab.propTypes = {

    dispatch: PropTypes.func.isRequired,

    vehicleId: PropTypes.string.isRequired,

    carDetails: PropTypes.object,

    onSaved: PropTypes.func

};



export default CarFeatureTab;

