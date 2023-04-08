import { Button, Container, Grid, makeStyles } from "@material-ui/core"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { nanoid } from "@reduxjs/toolkit"

import { addCharacter } from "@/reducers/characterReducer"

import ControlledInputField from "../ControlledInputField"
import ControlledSelectInputField from "../ControlledSelectInputField/ControlledSelectInputField"

const useStyles = makeStyles((theme) => ({
  title: {
    borderBottom: "1px solid grey",
    padding: theme.spacing(1),
    fontWeight: theme.typography.fontWeightBold,
  },

  body: {
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    width: "30vw",
  },

  buttonBox: {
    display: "flex",
    gap: theme.spacing(2),
    position: "absolute",
    bottom: 0,
    padding: theme.spacing(2),
    "& > *": {
      color: theme.palette.common.white,
    },
    "& > :first-child": {
      backgroundColor: theme.palette.button.main,
    },
    "& > :last-child": {
      backgroundColor: theme.palette.grey[400],
    },
  },
}))

const AddNewCharacterForm = ({ setOpen }) => {
  const classes = useStyles()
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      eyeColor: "",
      height: "",
      gender: "",
      birthYear: "",
      homeworld: "",
      species: "",
      numberOfFilms: "",
    },
    reValidateMode: "onSubmit",
  })

  const dispatch = useDispatch()

  const onSubmit = (data) => {
    if (data.name && data.eyeColor) {
      dispatch(
        addCharacter({
          id: nanoid(),
          name: data.name,
          eyeColor: data.eyeColor,
          height: data.height,
          gender: data.gender,
          birthYear: data.birthYear,
          homeworld: {
            id: nanoid(),
            name: data.homeworld,
          },
          species: {
            id: nanoid(),
            name: data.species,
          },
          filmConnection: {
            totalCount: data.numberOfFilms,
          },
        })
      )
    }
  }

  return (
    <>
      <Container
        className={classes.title}
        color="text.disabled"
      >
        Add New Character
      </Container>
      <div className={classes.body}>
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs
          >
            <ControlledInputField
              control={control}
              name="name"
              label="Name"
              placeholder="Enter name"
            />
          </Grid>
          <Grid
            item
            xs
          >
            <ControlledInputField
              control={control}
              name="eyeColor"
              label="Eye Color"
              placeholder="Enter eye color"
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs
          >
            <ControlledInputField
              control={control}
              name="height"
              label="Height"
              placeholder="Enter height"
              type="number"
            />
          </Grid>
          <Grid
            item
            xs
          >
            <ControlledSelectInputField
              control={control}
              name="gender"
              label="Gender"
              placeholder="Select gender"
              options={["Male", "Female"]}
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs
          >
            <ControlledInputField
              control={control}
              name="birthYear"
              label="Birth Year"
              placeholder="Enter birth year"
            />
          </Grid>
          <Grid
            item
            xs
          >
            <ControlledInputField
              control={control}
              name="homeworld"
              label="HomeWorld"
              placeholder="Enter homeworld"
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs
          >
            <ControlledSelectInputField
              control={control}
              name="species"
              label="Species"
              placeholder="Select species"
              options={["Droid", "Human"]}
            />
          </Grid>
          <Grid
            item
            xs
          >
            <ControlledInputField
              control={control}
              name="numberOfFilms"
              label="Number Of Films"
              placeholder="Enter number of films appeared"
              type="number"
            />
          </Grid>
        </Grid>
      </div>
      <div className={classes.buttonBox}>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          size="large"
        >
          Submit
        </Button>
        <Button
          variant="contained"
          onClick={() => setOpen(false)}
          size="large"
        >
          Cancel
        </Button>
      </div>
    </>
  )
}

export default AddNewCharacterForm
