import React, { useEffect, useReducer, useRef } from 'react';

import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';

import LoaderSpiner from '../../hooks/LoaderSpiner';

import Button from '../common/Button/Button';

import CommonModel from '../common/model/CommonModel';

import FeatureCheckboxGroup from '../CarTemplate/FeatureCheckboxGroup';

import { notify } from '../../utils/helpers';

import { getTemplate, getGroupedFeatures } from '../../services/vendorCarTemplate.service';

import { updateCarDetails } from '../../Redux/Actions/carAction';

import { generateCarDescription } from '../../services/ai.service';



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



const MIN_CAR_DESCRIPTION_LENGTH = 100;



function validateCarDescriptionForCopy(carDescription) {

    return (carDescription || '').trim().length >= MIN_CAR_DESCRIPTION_LENGTH;

}



function buildCopyContent(carDescription, profileTemplate, featureNames) {

    const featuresLine = featureNames.length ? featureNames.join(', ') : '';

    return {

        carDescription: carDescription || '',

        featuresLine,

        profileTemplate: profileTemplate || '',

    };

}



function buildCopyText(carDescription, profileTemplate, featureNames) {

    const content = buildCopyContent(carDescription, profileTemplate, featureNames);



    return [

        content.carDescription,

        '',

        content.featuresLine,

        '',

        content.profileTemplate,

    ].join('\n');

}



function CopyPreviewContent({ content }) {

    return (

        <>

            <div className="car-copy-preview-section mb-3">

                <p className="car-copy-preview-text mb-0">{content.carDescription || '-'}</p>

            </div>

            <div className="car-copy-preview-section mb-3">

                <p className="car-copy-preview-text mb-0">{content.featuresLine || '-'}</p>

            </div>

            <div className="car-copy-preview-section">

                <p className="car-copy-preview-text mb-0">{content.profileTemplate || '-'}</p>

            </div>

        </>

    );

}



function buildAiPayload(carDetails = {}, featureNames = []) {

    const payload = {

        brand: carDetails.carBrand || '',

        model: carDetails.carModel || '',

        year: carDetails.carYear || '',

        type: carDetails.carType || '',

        features: featureNames,

    };



    const optionalMap = {

        color: carDetails.carColor,

        fuelType: carDetails.fuelType,

        transmission: carDetails.transmission,

        engine: carDetails.engine,

        mileage: carDetails.mileage,

        seatingCapacity: carDetails.seatingCapacity,

        bodyType: carDetails.bodyType,

        variant: carDetails.variant,

        numberOfDoors: carDetails.numberOfDoors,

    };



    Object.entries(optionalMap).forEach(([key, value]) => {

        if (value !== undefined && value !== null && String(value).trim() !== '') {

            payload[key] = String(value).trim();

        }

    });



    return payload;

}



function CarFeatureTab({ dispatch, vehicleId, carDetails, onSaved }) {

    const { t } = useTranslation();

    const aiAbortRef = useRef(null);

    const [state, setState] = useReducer(

        (prev, next) => ({ ...prev, ...next }),

        {

            loader: true,

            saving: false,

            generating: false,

            copying: false,

            previewOpen: false,

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



    useEffect(() => {

        return () => {

            if (aiAbortRef.current) {

                aiAbortRef.current.abort();

            }

        };

    }, []);



    const handleAiGenerate = async () => {

        const featureNames = resolveFeatureNamesFromGroups(

            state.groupedFeatures,

            state.selectedFeatures

        );



        const payload = buildAiPayload(carDetails, featureNames);



        if (!payload.brand || !payload.model || !payload.year || !payload.type) {

            notify('error', t('aiGenerateMissingFields'));

            return;

        }



        if (aiAbortRef.current) {

            aiAbortRef.current.abort();

        }



        const controller = new AbortController();

        aiAbortRef.current = controller;



        setState({ generating: true });



        try {

            const response = await generateCarDescription(payload, {

                signal: controller.signal,

            });



            if (aiAbortRef.current !== controller) {

                return;

            }



            if (response?.statusCode == 1) {

                const description =

                    response?.responseData?.description ||

                    response?.description ||

                    '';



                if (description) {

                    setState({ carDescription: description, generating: false });

                    notify('success', t('aiGenerateSuccess'));

                } else {

                    setState({ generating: false });

                    notify('error', t('aiGenerateError'));

                }

            } else {

                setState({ generating: false });

                notify(

                    'error',

                    response?.error?.responseMessage || t('aiGenerateError')

                );

            }

        } catch (error) {

            if (aiAbortRef.current !== controller) {

                return;

            }



            const isCanceled =

                error?.code === 'ERR_CANCELED' ||

                error?.name === 'CanceledError';



            if (isCanceled) {

                setState({ generating: false });

                return;

            }



            setState({ generating: false });

            notify(

                'error',

                error?.error?.responseMessage || error?.message || t('aiGenerateError')

            );

        } finally {

            if (aiAbortRef.current === controller) {

                aiAbortRef.current = null;

            }

        }

    };



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



    const getCopyContext = () => {

        const featureNames = resolveFeatureNamesFromGroups(

            state.groupedFeatures,

            state.selectedFeatures

        );



        return {

            featureNames,

            content: buildCopyContent(

                state.carDescription,

                state.mainDescription,

                featureNames

            ),

            copyText: buildCopyText(

                state.carDescription,

                state.mainDescription,

                featureNames

            ),

        };

    };



    const validateBeforeCopy = () => {

        if (!validateCarDescriptionForCopy(state.carDescription)) {

            notify('error', t('carFeatureCopyValidationError'));

            return false;

        }

        return true;

    };



    const handleCopyDetails = async () => {

        if (!validateBeforeCopy()) {

            return;

        }



        const { copyText } = getCopyContext();



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



    const handleCopyAndPreview = async () => {

        if (!validateBeforeCopy()) {

            return;

        }



        const { copyText } = getCopyContext();



        setState({ copying: true });



        try {

            await navigator.clipboard.writeText(copyText);

            notify('success', t('copiedToClipboard'));

            setState({ previewOpen: true, copying: false });

        } catch (error) {

            notify('error', t('carFeatureCopyError'));

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

                <div className="d-flex gap-2">

                    <Button

                        type="button"

                        className="btn btn-secondary"

                        disabled={state.copying}

                        onClick={handleCopyDetails}

                    >

                        {t('carFeatureCopyDetails')}

                    </Button>

                    <Button

                        type="button"

                        className="btn btn-secondary"

                        disabled={state.copying}

                        onClick={handleCopyAndPreview}

                    >

                        {t('carFeatureCopyAndPreview')}

                    </Button>

                </div>

            </div>



            <div className="car-template-section mb-4">

                <div className="d-flex justify-content-between align-items-center mb-2">

                    <label className="form-label mb-0">{t('carTemplateCarDescription')}</label>

                    <Button

                        type="button"

                        className="btn btn-secondary btn-sm"

                        disabled={state.generating}

                        onClick={handleAiGenerate}

                    >

                        {state.generating ? t('aiGenerating') : t('aiGenerate')}

                    </Button>

                </div>

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



            <CommonModel

                show={state.previewOpen}

                size="modal-lg"

                customeClass="car-copy-preview-modal"

                onClose={() => setState({ previewOpen: false })}

            >

                <CopyPreviewContent content={getCopyContext().content} />

            </CommonModel>

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

