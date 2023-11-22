import {
  TextField,
  Select,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  MenuItem,
  Grid,
  Container,
  Button,
} from '@mui/material'

import { useState } from 'react'
import './checkinPage.css'
import { HNumWrapper } from '../../Wrappers.js'

export default function CheckinPage() {
  const [liveWithUnder16, setLiveWithUnder16] = useState('')
  const [employed, setEmployed] = useState('')
  const [needJobAssistance, setNeedJobAssistance] = useState('')
  const [needHousingAssistance, setNeedHousingAssistance] = useState('')
  const [interestedInSNAP, setInterestedInSNAP] = useState('')
  const [gender, setGender] = useState('')
  const [ethnicity, setEthnicity] = useState('')

  async function handleNewShopperSubmit(event) {}

  async function handleReturningShopperSubmit(event) {}

  return (
    <Container maxWidth="md">
      <Grid item xs={6}>
        <FormControl>
          <HNumWrapper />
          <Button variant="contained" color="primary" onClick={handleNewShopperSubmit}>
            Submit
          </Button>
        </FormControl>
      </Grid>

      <div className="verticalLine" />

      <Grid container spacing={4} className="newShopperContainer">
        {/* Left Section (Returning Shopper) */}
        <FormControl>
          <h1>New Shopper</h1>
          <div className="newShopperTextFields">
            <HNumWrapper />
            <TextField label="Classification" />
            <TextField label="Home" helperText="State ABBR or Country" />
            <Select value={gender} onChange={e => setGender(e.target.value)}>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
            <TextField label="Box Number" />
            <Select value={ethnicity} onChange={e => setEthnicity(e.target.value)}>
              <MenuItem value="African American">African American</MenuItem>
              <MenuItem value="Asian">Asian</MenuItem>
              <MenuItem value="Caucasian">Caucasian</MenuItem>
              <MenuItem value="Hispanic/Latino">Hispanic/Latino</MenuItem>
              <MenuItem value="Pacific Islander">Pacific Islander</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
            <TextField label="Dietary Restrictions" />
          </div>
          <div className="newShopperButtons">
            <FormControl component="fieldset">
              <label>Do you live with anyone aged 16 or under?</label>
              <RadioGroup
                value={liveWithUnder16}
                onChange={e => setLiveWithUnder16(e.target.value)}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            <FormControl component="fieldset">
              <label>Are you employed?</label>
              <RadioGroup value={employed} onChange={e => setEmployed(e.target.value)}>
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            {employed === 'No' && (
              <FormControl component="fieldset">
                <label>Would you like assistance with finding a job?</label>
                <RadioGroup
                  value={needJobAssistance}
                  onChange={e => setNeedJobAssistance(e.target.value)}
                >
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            )}

            <FormControl component="fieldset">
              <label>Do you need assistance with finding housing?</label>
              <RadioGroup
                value={needHousingAssistance}
                onChange={e => setNeedHousingAssistance(e.target.value)}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            <FormControl component="fieldset">
              <label>
                Are you interested in learning about the Supplemental Nutrition Assistance Program
                (SNAP) for college students?
              </label>
              <RadioGroup
                value={interestedInSNAP}
                onChange={e => setInterestedInSNAP(e.target.value)}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </div>

          <Button variant="contained" color="primary" onClick={handleReturningShopperSubmit}>
            Submit
          </Button>
        </FormControl>
      </Grid>
    </Container>
  )
}
