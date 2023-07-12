import { makeStyles } from "@material-ui/core/styles"
import { Typography } from "@material-ui/core"
import { useLazyQuery } from "@apollo/client"
import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/router"
import { findIndex } from "lodash"

import CharactersTable from "./CharactersTable/CharactersTable"
import RightSideDrawer from "../RightSideDrawer/RightSideDrawer"
import CharacterForm from "./CharacterForm/CharacterForm"
import { GET_ALL_CHARACTERS } from "@/graphql/queries/characterQueries"
import { formModeEnum } from "@/enums/formModeEnum"

const useStyles = makeStyles(() => ({
  body: {
    display: "grid",
    placeItems: "center",
    gap: "10px",
    padding: "25px",
  },
  button: {
    placeSelf: "end",
  },
}))

export default function CharactersPage() {
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [tablePage, setTablePage] = useState(0)
  const classes = useStyles()
  const router = useRouter()
  const { params } = router.query

  const [fetchCharacters, { error, loading, called, data, refetch }] =
    useLazyQuery(GET_ALL_CHARACTERS, {
      fetchPolicy: "network-only",
      notifyOnNetworkStatusChange: true,
    })

  /* This is for the table data fetching */
  useEffect(() => {
    fetchCharacters({
      variables: {
        first: rowsPerPage,
      },
    })
  }, [])

  const characters = useMemo(() => {
    if (!data) return []
    return data.allPeople.people
  }, [data])

  const isFormOpen = useMemo(() => {
    return params && Object.values(formModeEnum).includes(params[0])
  }, [params])

  /* This is to validate the pathname */
  useEffect(() => {
    if (!params) return

    if (params.length > 2) {
      handleCloseForm()
    }

    if (params.length > 0 && !isFormOpen) {
      handleCloseForm()
    }
  }, [params, isFormOpen])

  /* This is to validate the character is valid to edit */
  useEffect(() => {
    if (!params) return

    const characterIndex = findIndex(characters, (character) => {
      return character.id === params[1]
    })

    if (characterIndex === -1) {
      handleCloseForm()
    }
  }, [params, characters])

  const pageInfo = data?.allPeople.pageInfo
  const totalRowsCount = data?.allPeople.totalCount

  const handleOpenForm = (id) => {
    const params = id ? [formModeEnum.edit, id] : [formModeEnum.new]

    router.push({
      pathname: "/characters/[[...params]]",
      query: { params },
    })
  }

  const handleCloseForm = () => {
    router.push("/characters/[[...params]]")
  }

  if (!called && loading) return <div>loading...</div>
  if (error) return <div>{error.message}</div>

  return (
    <div className={classes.body}>
      <RightSideDrawer
        isOpen={isFormOpen}
        onClose={handleCloseForm}
      >
        <CharacterForm onClose={handleCloseForm} />
      </RightSideDrawer>
      <Typography variant="h2">Star Wars</Typography>

      <CharactersTable
        characters={characters}
        tablePageInfo={pageInfo}
        totalRowsCount={totalRowsCount}
        rowsPerPage={rowsPerPage}
        tablePage={tablePage}
        onRowsPerPage={setRowsPerPage}
        onTablePage={setTablePage}
        onRowClick={({ id }) => handleOpenForm(id)}
        onRefetch={refetch}
      />
    </div>
  )
}
