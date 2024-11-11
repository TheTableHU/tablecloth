import React, { useEffect, useRef, useState } from 'react';
import { Stepper, Step, Button, Typography } from '@material-tailwind/react';
import { CogIcon, UserIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';
import { Api } from '@mui/icons-material';
import { useNewApi } from '../../../api';
import { Paper } from '@mui/material';
import { toast, ToastWrapper } from '../../Wrappers';

export default function TrainingModules({isTrained, setIsTrained}) {
  const api = useNewApi();
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);
  const [videoWatched, setVideoWatched] = useState(false);
  async function handleDone() {
    let result = await api.updateTraining();
    setIsTrained(true);
  }
  const handleVideoEnded = () => {
    setVideoWatched(true);
  };
  const videoRefs = useRef([React.createRef(), React.createRef(), React.createRef()]);
  const [lastAllowedTime, setLastAllowedTime] = useState(0);

  const handleVideoTimeUpdate = () => {
    if (videoRefs.current[activeStep]) {
      const currentTime = videoRefs.current[activeStep].current.currentTime;
      setLastAllowedTime(currentTime);
    }
  };

  const handleSeeking = (e) => {
    if (videoRefs.current[activeStep]) {
      const currentTime = videoRefs.current[activeStep].current.currentTime;
      if (currentTime > lastAllowedTime) {
        videoRefs.current[activeStep].current.currentTime = lastAllowedTime;
      }
    }
  };

  useEffect(() => {
    const videoElement = videoRefs.current[activeStep]?.current; 

    if (videoElement) {
      videoElement.addEventListener('timeupdate', handleVideoTimeUpdate);
      videoElement.addEventListener('seeking', handleSeeking);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('timeupdate', handleVideoTimeUpdate);
        videoElement.removeEventListener('seeking', handleSeeking);
      }
    };
  }, [activeStep, lastAllowedTime]); 
  let stepData = [];
  stepData.push(
    <>
      <h1>
        <strong>A Shopper came to The Table, what do I do?</strong>
      </h1>
      <br />
      <h2 style={{ marginLeft: '8px' }}>
        <strong>1. Welcome them</strong>
      </h2>
      <h3 style={{ marginLeft: '12px' }}>
        Make the shoppers feel welcome, this can help them feel less nervous and embarrased.{' '}
      </h3>
      <br />
      <h2 style={{ marginLeft: '8px' }}>
        <strong>2. Ask if they have been to The Table before</strong>
      </h2>
      <h3 style={{ marginLeft: '12px' }}>
        If it's their first time, have them fill out the New Shopper Form.
      </h3>
      <h3 style={{ marginLeft: '12px' }}>
        If it's not, ask if they want a bag and instruct them to start taking the items they need.
        When finished, they can head to the back to checkout.
      </h3>
      <br />
      <div className="flex justify-center">
        <video
          className="w-4/5 rounded-lg" // 80% width (100% - 20%)
          controls
          autoPlay
          ref={videoRefs.current[0]}
          onEnded={handleVideoEnded}
        >
          <source src="training_new_shopper.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </>,
  );
  stepData.push(
    <>
      <h1>
        <strong>Procedure on Checking Out Items</strong>
      </h1>
      <br />
      <div className="flex justify-center">
        <video
          ref={videoRefs.current[1]}
          className="w-4/5 rounded-lg" // 80% width (100% - 20%)
          controls
          autoPlay
          onEnded={handleVideoEnded}
        >
          <source src="training_checkout.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <h2 style={{ marginLeft: '8px' }}>
        <strong>1. Navigate to Check Out page</strong>
      </h2>
      <br />
      <h2 style={{ marginLeft: '8px' }}>
        <strong>2. Scan the Shopper's ID</strong>
      </h2>
      <br />
      <h3 style={{ marginLeft: '12px' }}>
        Make sure that they have their ID with them. They cannot shop if they don't have their ID.
        If they don't have their ID, check if there is a desk worker available. The system will not
        allow you to perform a checkout transaction without a Harding ID.
      </h3>
      <br />
      <h2 style={{ marginLeft: '8px' }}>
        <strong>3. Start scanning every item</strong>
      </h2>
      <br />
      <h3 style={{ marginLeft: '12px' }}>
        You may scan an item more than once to increase the quantity. You may also change the
        quantity after scanning the item. If you do this, please make sure they are exactly the same
        brand, flavor or type. Some items may look similar but have a different barcode.
      </h3>
      <br />
      <h3 style={{ marginLeft: '12px' }}>
        If an item does not have a barcode, there are some pages with products and barcodes on the
        desk. <strong>DO NOT</strong> select an item from the drowpdown list unless you can't find
        it on the printed list. For example, we may have 5 different Colgate Toothpaste items, and
        you might be choosing the incorrect type.
      </h3>
      <br />
      <h2 style={{ marginLeft: '8px' }}>
        <strong>4. Double check the item list</strong>
      </h2>
      <br />
      <h3 style={{ marginLeft: '12px' }}>
        When you are done scanning, please double check the list of items to make sure you didn't
        forget to scan an item. Sometimes you might be scanning items while the barcode input is not
        selected, resulting in the items not being added to the cart. Double check quantities too.
        When you are done, hit the purple <strong>Checkout</strong> button located at the bottom
        right side of the page.
      </h3>
      <br />
      <h2 style={{ marginLeft: '8px' }}>
        <strong>5. Exceptions</strong>
      </h2>
      <br />
      <h3 style={{ marginLeft: '12px' }}>
        When scanning a Shopper's Harding ID, the system might give you the following errors:
      </h3>
      <br />
      <h3 style={{ marginLeft: '12px' }}>
        <strong>Shopper Not Found:</strong> First, try to scan the Harding ID again, if you get the
        same error, then it means that the Shopper has not filled out the New Shopper Form, direct
        them to the front desk to register as a new shopper and then checkout.
      </h3>
      <br />
      <h3 style={{ marginLeft: '12px' }}>
        <strong>Shopper Has Been Twice This Week:</strong> This should not happen very often. But
        every Shopper is allowed to come to The Table twice a week. Remind them that they are only
        allowed 2 weekly visits to The Table. If the Shopper says they have not been twice this
        week, get a desk worker to handle the situation.
      </h3>
      <br />
    </>,
  );
  stepData.push(
    <>
      <h1>
        <strong>Please follow this procedure to handle inventory</strong>
      </h1>
      <br />
      <div className="flex justify-center" key="extra-step">
        <video
        key="extra"
          ref={videoRefs.current[2]}
          className="w-4/5 rounded-lg" // 80% width (100% - 20%)
          controls
          autoPlay
          onEnded={handleVideoEnded}
        >
          <source src="training_inventory.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <h2 style={{ marginLeft: '8px' }}>
        <strong>1. Correctly placing items</strong>
      </h2>
      <h3 style={{ marginLeft: '12px' }}>
        All items that have not been added to inventory will first go to <strong>room 124</strong>.
        Workers, at the beginning of your shift please add those items to inventory following steps
        2 and 3. After the items have been added to inventory, you must move them to{' '}
        <strong>room 125.</strong>
      </h3>
      <br />
      <h3 style={{ marginLeft: '12px' }}>
        All items in <strong> room 125 have already been added to inventory. </strong> you may move
        those to the shelves if needed without having to alter inventory.
      </h3>
      <br />
      <h2 style={{ marginLeft: '8px' }}>
        <strong>2. Processing Shipment </strong>
      </h2>
      <h3 style={{ marginLeft: '12px' }}>
        If there are items in <strong> room 124</strong> please follow this procedure:
      </h3>
      <h3 style={{ marginLeft: '12px' }}>
        If multiple items come in a box, DO NOT scan the barcode on the outer box. Check if the
        items come with a barcode. If they do, sort them based on flavor, type, or presentation.
        Make sure you separate items that have a different barcode. For example, sometimes we have
        boxes with a variety of Protein Bars, they come in different flavors and every flavor has a
        different barcode. Make sure to check this.
      </h3>
      <br />
      <h3 style={{ marginLeft: '12px' }}>
        After you have sorted the items based on barcode (all items with same barcode together), go
        to Inventory - Shipment and start scanning all the items. Change the quantity after scanning
        the item.
      </h3>
      <br />
      <h3 style={{ marginLeft: '12px' }}>
        <strong>What if the item does not have a barcode?</strong>
      </h3>
      <h3 style={{ marginLeft: '12px' }}>
        Check the printed list of barcodes on the checkout desk. Try to find the item there, scan
        the barcode you found and enter the quantity. If you did not find it, leave the items in
        room 124 and someone else will enter them into the system.
      </h3>
      <br />
      <h3 style={{ marginLeft: '12px' }}>
        If after scanning the item you get an error saying "Barcode not found", it means that we
        have never had that item before, so its not on the database. In this case, move to step 3.
      </h3>
      <br />
      <h3 style={{ marginLeft: '12px' }}>
        After scanning all items and making sure that barcodes and quantities are correct, hit the
        purple button on the bottom right that says <strong>Add to Inventory</strong>. That's it!
        You have successfully added items to inventory.
      </h3>
      <br />
      <h2 style={{ marginLeft: '8px' }}>
        <strong>3. Adding New Items </strong>
      </h2>
      <h3 style={{ marginLeft: '12px' }}>
        Fairly often, we will get items that we have never had before. In this case, you won't be
        able to add them to Inventory by going to the Shipment Page. In this case, you must go to
        the <strong>Add Items</strong> page. Please follow the following procedure:
      </h3>
      <br />
      <h3 style={{ marginLeft: '12px' }}>
        Scan the item's barcode. Please make sure to sort them as stated in step 1. After scanning
        the barcode, wait a few seconds; the system will try to lookup the item's name, description
        and picture from the internet. After you see the details appear, choose a category and enter
        the quantity of that item. Please note that we are entering the quantity here, so there is
        no need to go to shipment and add them again. When done, just submit the form. If you can't
        find a suitable category, you may add one by clicking on the + button next to the category
        dropdown.
      </h3>
      <br />
      <h3 style={{ marginLeft: '12px' }}>
        <strong>I got an error saying Barcode Info Not Found</strong>
      </h3>
      <br />
      <h3 style={{ marginLeft: '12px' }}>
        This means that the system could not find the item online. Don't worry, you will just have
        to type the name of the item manually and follow the same procedure described before.
      </h3>
      <br />
    </>,
  );

  const paperRef = useRef(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeStep]);
  const handleNext = () => {
    !isLastStep && setActiveStep((cur) => cur + 1);
    setVideoWatched(false);
    scrollToTop();
    setLastAllowedTime(0);
  };
  const handlePrev = () => {
    !isFirstStep && setActiveStep((cur) => cur - 1);
    scrollToTop();
  };
  const scrollToTop = () => {
    if (paperRef.current) {
      paperRef.current.scrollTop = 0;
    }
  };

  let steps = [];

  steps.push(
    <NewShopperModule activeStep={activeStep} setActiveStep={setActiveStep}></NewShopperModule>,
  );
  steps.push(
    <CheckoutModule activeStep={activeStep} setActiveStep={setActiveStep}></CheckoutModule>,
  );
  if (api.role == 'worker' || api.role == 'admin') {
    steps.push(
      <ShipmentModule activeStep={activeStep} setActiveStep={setActiveStep}></ShipmentModule>,
    );
  }

  return (
    <>
    <ToastWrapper/>
      <div className="w-full px-24 py-4">
        <Stepper
          style={{
            height: '6vh',
          }}
          activeStep={activeStep}
          isLastStep={(value) => setIsLastStep(value)}
          isFirstStep={(value) => setIsFirstStep(value)}
        >
          {steps}
        </Stepper>
        <Paper
          ref={paperRef}
          elevation={15}
          sx={{
            marginTop: '70px',
            height: '72vh',
            width: '100%',
            overflow: 'auto',
          }}
        >
          <div style={{ padding: '20px' }}>{stepData[activeStep]}</div>
        </Paper>
        <div className="mt-1 flex justify-between">
          <Button onClick={handlePrev} disabled={isFirstStep}>
            Prev
          </Button>
          <Button onClick={handleNext} disabled={!videoWatched || isLastStep}>
            {!videoWatched ? 'Please watch training video' : 'Next'}
          </Button>
          {isLastStep && videoWatched && <Button onClick={handleDone}>Finish Training</Button>}
        </div>
      </div>
    </>
  );
}
function NewShopperModule({ activeStep, setActiveStep }) {
  return (
    <>
      <Step>
        <UserIcon className="h-5 w-5" />
        <div className="absolute -bottom-[4rem] w-max text-center">
          <Typography variant="h6" color={activeStep === 0 ? 'blue-gray' : 'gray'}>
            New Shopper Form
          </Typography>
          <Typography color={activeStep === 2 ? 'blue-gray' : 'gray'} className="font-normal">
            Handling new shoppers
          </Typography>
        </div>
      </Step>
    </>
  );
}
function CheckoutModule({ activeStep, setActiveStep }) {
  return (
    <>
      <Step>
        <CogIcon className="h-5 w-5" />
        <div className="absolute -bottom-[4rem] w-max text-center">
          <Typography variant="h6" color={activeStep === 1 ? 'blue-gray' : 'gray'}>
            Checking Out Items
          </Typography>
          <Typography color={activeStep === 2 ? 'blue-gray' : 'gray'} className="font-normal">
            How to correctly process a checkout transaction
          </Typography>
        </div>
      </Step>
    </>
  );
}
function ShipmentModule({ activeStep, setActiveStep }) {
  return (
    <>
      <Step>
        <BuildingLibraryIcon className="h-5 w-5" />
        <div className="absolute -bottom-[4rem] w-max text-center">
          <Typography variant="h6" color={activeStep === 2 ? 'blue-gray' : 'gray'}>
            Shipment Procedure
          </Typography>
          <Typography color={activeStep === 2 ? 'blue-gray' : 'gray'} className="font-normal">
            How to add items to inventory
          </Typography>
        </div>
      </Step>
    </>
  );
}
