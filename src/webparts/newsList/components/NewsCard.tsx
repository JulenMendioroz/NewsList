import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardDetails,
  DocumentCardTitle,
  DocumentCardType,
  Text,
} from "@fluentui/react"
import * as React from "react"
import { INews } from "./INews"

export default function NewsCard(props: INews): React.ReactElement {
  const { title, description, publishedAt, author } = props
  return (
    <DocumentCard
      key={title}
      aria-label={description}
      type={DocumentCardType.compact}
    >
      <DocumentCardDetails>
        <DocumentCardTitle title={title} />
        <DocumentCardActivity
          activity={`Published at ${publishedAt}`}
          people={[{ name: author, profileImageSrc: "" }]}
        />
        <Text block variant="large">
          {description}
        </Text>
      </DocumentCardDetails>
    </DocumentCard>
  )
}
