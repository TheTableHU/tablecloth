import {
  TextField,
  Select,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  MenuItem,
  Container,
  Button,
  InputLabel,
  Typography,
} from '@mui/material'

import config from '../../config.js'

import { useState } from 'react'
import './checkinPage.css'
import { HNumWrapper, toast, ToastWrapper } from '../../Wrappers.js'

export default function CheckinPage() {
  const [returningHNum, setReturningHNum] = useState('')
  const [newHNum, setNewHNum] = useState('')
  const [liveWithUnder16, setLiveWithUnder16] = useState('')
  const [employed, setEmployed] = useState('')
  const [needJobAssistance, setNeedJobAssistance] = useState('')
  const [needHousingAssistance, setNeedHousingAssistance] = useState('')
  const [interestedInSNAP, setInterestedInSNAP] = useState('')
  const [gender, setGender] = useState('')
  const [ethnicity, setEthnicity] = useState('')
  const [classification, setClassification] = useState('')
  const [dietValue, setDietValue] = useState('')
  const [homeValue, setHomeChange] = useState('')
  const [boxValue, setBoxValue] = useState('')
  const [email, setEmail] = useState('')

  const [displayNewShopperForm, setDisplayNewShopperForm] = useState(true)

  const handleHNumChange = (event, hNumType) => {
    const value = event.target.value.slice(0, 8)

    if (hNumType === 'returning') {
      setReturningHNum(value)
    } else if (hNumType === 'new') {
      setNewHNum(value)
    }
  }

  function clearForm() {
    setReturningHNum('')
    setNewHNum('')
    setLiveWithUnder16('')
    setEmployed('')
    setNeedJobAssistance('')
    setNeedHousingAssistance('')
    setInterestedInSNAP('')
    setGender('')
    setEthnicity('')
    setClassification('')
    setDietValue('')
    setHomeChange('')
    setBoxValue('')
    setEmail('')
  }

  const handleHomeChange = event => {
    setHomeChange(event.target.value)
  }

  const handleBoxChange = event => {
    setBoxValue(event.target.value)
  }

  const handleDietChange = event => {
    setDietValue(event.target.value)
  }

  const toggleFormDisplay = () => {
    setDisplayNewShopperForm(!displayNewShopperForm)
  }

  const handleEmailChange = event => {
    setEmail(event.target.value)
  }

  async function handleNewShopperSubmit(event) {
    const formData = {
      hNumber: newHNum,
      liveWithUnder16: liveWithUnder16,
      employed: employed,
      needJobAssistance: needJobAssistance,
      needHousingAssistance: needHousingAssistance,
      interestedInSNAP: interestedInSNAP,
      gender: gender,
      ethnicity: ethnicity,
      classification: classification,
      diet: dietValue,
      home: homeValue,
      box: boxValue,
      email: email,
    }

    try {
      const response = await fetch(`${config.host}/api/shopper/checkin/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      })

      if (response.ok) {
        toast.success('Shopper registered successfully! Welcome!')
        clearForm()
      } else {
        // Handle non-successful responses
        toast.error('Failed to register shopper. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  async function handleReturningShopperSubmit(event) {
    try {
      const response = await fetch(`${config.host}/api/shopper/checkin/${returningHNum}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        toast.success('Shopper checked in successfully! Welcome back!')
      } else {
        toast.error('Failed to check in shopper. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const newShopperForm = () => {
    return (
      <div className="newShopper">
        <h1>New Shopper</h1>
        <div className="newShopperFormContainer">
          <FormControl fullWidth>
            <HNumWrapper value={newHNum} onChange={(event) => handleHNumChange(event, 'new')} />
          </FormControl>
          <div className="formRow">
            <FormControl fullWidth>
              <InputLabel htmlFor="classification">Classification</InputLabel>
              <Select
                value={classification}
                labelId="classification"
                onChange={e => setClassification(e.target.value)}
              >
                <MenuItem value="Undergraduate">Undergraduate</MenuItem>
                <MenuItem value="Graduate">Graduate</MenuItem>
                <MenuItem value="Faculty">Faculty</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="formRow">
            <FormControl fullWidth>
              <TextField
                id="home"
                value={homeValue}
                onChange={handleHomeChange}
                label="Home"
                helperText="State ABBR or Country"
              />
            </FormControl>
          </div>

          <div className="formRow">
            <FormControl fullWidth>
              <InputLabel htmlFor="gender">Gender</InputLabel>
              <Select value={gender} labelId="gender" onChange={e => setGender(e.target.value)}>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="formRow">
            <FormControl fullWidth>
              <TextField
                id="boxNumber"
                label="Box Number"
                value={boxValue}
                onChange={handleBoxChange}
              />
            </FormControl>
          </div>

          <div className="formRow">
            <FormControl fullWidth>
              <InputLabel htmlFor="ethnicity">Ethnicity</InputLabel>
              <Select
                labelId="ethnicity"
                value={ethnicity}
                onChange={e => setEthnicity(e.target.value)}
              >
                <MenuItem value="African American">African American</MenuItem>
                <MenuItem value="Asian">Asian</MenuItem>
                <MenuItem value="Caucasian">Caucasian</MenuItem>
                <MenuItem value="Hispanic/Latino">Hispanic/Latino</MenuItem>
                <MenuItem value="Pacific Islander">Pacific Islander</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="formRow">
            <FormControl fullWidth>
              <TextField
                id="dietaryRestrictions"
                label="Dietary Restrictions"
                value={dietValue}
                onChange={handleDietChange}
              />
            </FormControl>
          </div>

          <div className="formRow">
            <FormControl component="fieldset">
              <Typography variant="subtitle1" className="questionText">
                Do you live with anyone aged 16 or under?
              </Typography>
              <RadioGroup
                value={liveWithUnder16}
                onChange={e => setLiveWithUnder16(e.target.value)}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </div>

          <div className="formRow">
            <FormControl component="fieldset">
              <Typography variant="subtitle1" className="questionText">
                Are you employed?
              </Typography>
              <RadioGroup value={employed} onChange={e => setEmployed(e.target.value)}>
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </div>

          <div className="formRow">
            <FormControl component="fieldset">
              <Typography variant="subtitle1" className="questionText">
                Would you like assistance with finding a job?
              </Typography>
              <RadioGroup
                value={needJobAssistance}
                onChange={e => setNeedJobAssistance(e.target.value)}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </div>

          <div className="formRow">
            <FormControl component="fieldset">
              <Typography variant="subtitle1" className="questionText">
                Do you need assistance with finding housing?
              </Typography>
              <RadioGroup
                value={needHousingAssistance}
                onChange={e => setNeedHousingAssistance(e.target.value)}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </div>

          <div className="formRow">
            <FormControl component="fieldset">
              <Typography variant="subtitle1" className="questionText">
                Are you interested in learning about the Supplemental Nutrition Assistance Program
                (SNAP) for college students?
              </Typography>
              <RadioGroup
                value={interestedInSNAP}
                onChange={e => setInterestedInSNAP(e.target.value)}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </div>
          </div>

          {(interestedInSNAP === 'Yes' || needHousingAssistance === "Yes" || needJobAssistance === "Yes")&& (
          <div className="formRow">
            <FormControl component="fieldset" fullWidth>
              <TextField
                id="email"
                label="Email"
                value={email}
                onChange={handleEmailChange}
              />
            </FormControl>
          </div>
          )}

        <div className="submitButtonContainer">
          <Button
            className="submitButton"
            variant="contained"
            color="primary"
            onClick={handleNewShopperSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    )
  }

  function returningShopperForm() {
    return (
      <div className="returningShopper">
        <h1>Returning Shopper</h1>
        <FormControl fullWidth>
          <HNumWrapper value={returningHNum} onChange={(event) => handleHNumChange(event, 'returning')} />
        </FormControl>

        <div className="submitButtonContainer">
          <Button
            className="submitButton"
            variant="contained"
            color="primary"
            onClick={handleReturningShopperSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Container maxWidth="md">
      <ToastWrapper />
      <div id="toggleFormContainer">
        <Button variant="contained" color="primary" onClick={toggleFormDisplay}>
          {displayNewShopperForm ? 'Show Returning Shopper Form' : 'Show New Shopper Form'}
        </Button>
      </div>

      {displayNewShopperForm ? newShopperForm() : returningShopperForm()}
    </Container>
  )
}
