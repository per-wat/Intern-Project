import { makeStyles } from "@material-ui/core"
import { useApolloClient } from "@apollo/client"

import AlertModal from "@/components/AlertModal"
import CancelButton from "@/components/Buttons/CancelButton/CancelButton"
import DeleteButton from "@/components/Buttons/DeleteButton/DeleteButton"
import {
  GET_ALL_CHARACTERS,
  GET_CHARACTER,
} from "@/graphql/queries/characterQueries"

const useStyles = makeStyles((theme) => ({
  body: {
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.h6.fontSize,
    fontFamily: theme.typography.fontFamily,
  },
  button: {
    display: "flex",
    gap: theme.spacing(2),
    justifyContent: "center",
    marginTop: theme.spacing(3),
  },
}))

const DeleteCharacterModal = ({ isModalOpen, onClose, character }) => {
  const classes = useStyles()
  const client = useApolloClient()

  const onDelete = () => {
    client.cache.modify({
      id: client.cache.identify({
        __typename: "Query",
        id: "ROOT_QUERY",
      }),
      fields: {
        allPeople(existing) {
          const characterToDelete = `Person:${character.id}`

          const newPeople = existing.people.filter(
            (character) => character.__ref !== characterToDelete
          )

          return {
            ...existing,
            people: newPeople,
          }
        },
      },
    })
    onClose()
  }

  if (!character) return

  return (
    <AlertModal
      isModalOpen={isModalOpen}
      onClose={onClose}
      title="Confirm delete character?"
    >
      <div className={classes.body}>{character.name}</div>
      <div className={classes.button}>
        <CancelButton onClick={onClose} />
        <DeleteButton onClick={onDelete} />
      </div>
    </AlertModal>
  )
}

export default DeleteCharacterModal
