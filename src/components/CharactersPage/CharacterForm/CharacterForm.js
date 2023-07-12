import { Box, Grid, makeStyles } from "@material-ui/core"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { useApolloClient, useQuery } from "@apollo/client"
import { has } from "lodash"

import { CHARACTER_FRAGMENT } from "@/graphql/fragments/characterFragments"
import { GET_CHARACTER } from "@/graphql/queries/characterQueries"
import { GET_ALL_SPECIES } from "@/graphql/queries/speciesQueries"
import { GET_ALL_HOMEWORLD } from "@/graphql/queries/homeworldQueries"
import { genderEnum } from "@/enums/genderEnum"
import { formModeEnum } from "@/enums/formModeEnum"
import {
  ControlledTextInputField,
  ControlledNumberInputField,
  ControlledSelectInputField,
} from "@/components/ControlledInputFields"
import * as formValidationUtils from "@/utils/formValidationUtils"
import {
  prepareCharacterForFormReset,
  prepareEditCharacterData,
} from "@/utils/CharactersPageUtils"
import ConfirmButton from "@/components/Buttons/ConfirmButton"
import CancelButton from "@/components/Buttons/CancelButton"
import DeleteButton from "@/components/Buttons/DeleteButton"
import DeleteCharacterModal from "../DeleteCharacterModal"

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    justifyContent: "center",
    height: "100%",
  },
  formHeader: {
    borderBottom: `1px solid ${theme.palette.grey[800]}`,
    padding: theme.spacing(1),
    fontWeight: theme.typography.fontWeightBold,
  },
  formBody: {
    flexGrow: 1,
    padding: "15px",
    overflow: "auto",
  },
  formFooter: {
    display: "flex",
    gap: theme.spacing(2),
    padding: theme.spacing(2),
  },
}))

const handlePrepareOptionsArray = (optionsArray = []) =>
  optionsArray.map((option) => ({
    value: option.id,
    label: option.name,
  }))

const CharacterForm = ({ onClose }) => {
  const classes = useStyles()
  const router = useRouter()
  const client = useApolloClient()
  const [errors, setErrors] = useState({})
  const [deleteCharacterModalOpen, setDeleteCharacterModalOpen] =
    useState(false)
  const { params = [] } = router.query

  const isEdit = useMemo(() => {
    return params[0] === formModeEnum.edit
  }, [params])

  const {
    error: characterError,
    loading: IsCharacterLoading,
    data: characterData,
  } = useQuery(GET_CHARACTER, {
    variables: {
      personId: params[1],
    },
  })

  const { loading: isAllSpeciesLoading, data: allSpeciesData } =
    useQuery(GET_ALL_SPECIES)

  const { loading: isAllHomeworldLoading, data: allHomeworldData } =
    useQuery(GET_ALL_HOMEWORLD)

  const speciesOptions = useMemo(() => {
    return handlePrepareOptionsArray(allSpeciesData?.allSpecies.species)
  }, [allSpeciesData])

  const homeworldOptions = useMemo(() => {
    return handlePrepareOptionsArray(allHomeworldData?.allPlanets.planets)
  }, [allHomeworldData])

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      eyeColor: "",
      height: "",
      gender: null,
      birthYear: "",
      homeworld: "",
      species: null,
      numberOfFilms: "",
    },
    reValidateMode: "onSubmit",
  })

  useEffect(() => {
    if (!characterData) return
    reset(prepareCharacterForFormReset(characterData.person))
  }, [characterData])

  const onSubmit = (formData) => {
    client.writeFragment({
      id: client.cache.identify({
        __typename: "Person",
        id: params[1],
      }),
      fragment: CHARACTER_FRAGMENT,
      data: prepareEditCharacterData({
        formData,
        character: characterData.person,
      }),
    })
    onClose()
  }

  const submit = handleSubmit(onSubmit, (errors) => {
    setErrors(errors)
  })

  const validateNameMinLength = (value) => {
    if (value.length < 3)
      return "This field should contain at least 3 characters"
    return true
  }

  const validateNamePattern = (value) => {
    const namePatternRegex = /^(?=(\s*\S){3})\s*[^\s].*$/
    if (!namePatternRegex.test(value))
      return "There should be at least 3 non-space characters!"

    return true
  }

  const handleHeightValidation = (value) => {
    if (value === "") return true

    return formValidationUtils.validateNumberWithinRange({
      min: 1,
      max: 300,
      value,
      errorReturn: "The height should range from 1 - 300",
    })
  }

  const handleNumberOfFilmValidation = (value) => {
    return formValidationUtils.validateNumberWithinRange({
      min: 1,
      value,
      errorReturn: "The minimum is 1",
    })
  }

  const handleOpenDeleteCharacterModal = () => {
    setDeleteCharacterModalOpen(true)
  }

  const handleCloseDeleteCharacterModal = () => {
    setDeleteCharacterModalOpen(false)
  }

  if (IsCharacterLoading) return <div>loading...</div>
  if (characterError) return <div>{characterError.message}</div>

  return (
    <>
      <DeleteCharacterModal
        isModalOpen={deleteCharacterModalOpen}
        onClose={handleCloseDeleteCharacterModal}
        character={characterData.person}
      />

      <Box className={classes.root}>
        <Box
          className={classes.formHeader}
          color="text.disabled"
        >
          {`Edit Character - ${characterData?.person?.name}`}
        </Box>
        <Box className={classes.formBody}>
          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              xs
            >
              <ControlledTextInputField
                isRequired
                control={control}
                errorMessage={errors.name?.message}
                name="name"
                label="Name"
                customValidationFunctions={{
                  validateNameMinLength,
                  validateNamePattern,
                }}
                TextFieldProps={{ placeholder: "Enter name" }}
              />
            </Grid>
            <Grid
              item
              xs
            >
              <ControlledTextInputField
                isRequired
                control={control}
                errorMessage={errors.eyeColor?.message}
                name="eyeColor"
                label="Eye Color"
                TextFieldProps={{ placeholder: "Enter eye color" }}
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
              <ControlledNumberInputField
                control={control}
                errorMessage={errors.height?.message}
                name="height"
                label="Height"
                customValidationFunctions={{ handleHeightValidation }}
                TextFieldProps={{ placeholder: "Enter height" }}
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
                SelectProps={{
                  isClearable: true,
                  options: [
                    { value: genderEnum.male, label: "Male" },
                    { value: genderEnum.female, label: "Female" },
                  ],
                  placeholder: "Select Gender",
                }}
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
              <ControlledTextInputField
                control={control}
                name="birthYear"
                label="Birth Year"
                TextFieldProps={{ placeholder: "Enter birth year" }}
              />
            </Grid>
            <Grid
              item
              xs
            >
              <ControlledSelectInputField
                isRequired
                control={control}
                errorMessage={errors.homeworld?.message}
                name="homeworld"
                label="HomeWorld"
                SelectProps={{
                  isClearable: true,
                  isSearchable: true,
                  isLoading: isAllHomeworldLoading,
                  options: homeworldOptions,
                  placeholder: "Select homeworld",
                }}
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
                SelectProps={{
                  isClearable: true,
                  isSearchable: true,
                  isLoading: isAllSpeciesLoading,
                  options: speciesOptions,
                  placeholder: "Select species",
                }}
              />
            </Grid>
            <Grid
              item
              xs
            >
              <ControlledNumberInputField
                isRequired
                control={control}
                errorMessage={errors.numberOfFilms?.message}
                name="numberOfFilms"
                label="Number Of Films"
                customValidationFunctions={{ handleNumberOfFilmValidation }}
                TextFieldProps={{
                  placeholder: "Enter number of films appeared",
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.formFooter}>
          <ConfirmButton
            label="Save"
            onClick={submit}
          />
          <CancelButton onClick={onClose} />
          {isEdit && (
            <div style={{ marginLeft: "auto" }}>
              <DeleteButton
                label="Delete Character"
                onClick={handleOpenDeleteCharacterModal}
              />
            </div>
          )}
        </Box>
      </Box>
    </>
  )
}

export default CharacterForm
