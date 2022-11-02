import * as React from "react"
import {
  DetailsList,
  DocumentCard,
  DocumentCardActivity,
  DocumentCardDetails,
  DocumentCardTitle,
  DocumentCardType,
  Stack,
} from "@fluentui/react"

import { getSP } from "../../../pnpjsConfig"
import { INewsListProps, NewsDisplayType } from "./INewsListProps"
import { INews } from "./INews"

export default function NewsList(props: INewsListProps): React.ReactElement {
  const { listGuid, displayType } = props

  const [news, setNews] = React.useState<INews[]>([])

  const getNews = React.useCallback(async (): Promise<INews[]> => {
    const news = await getSP()
      .web.lists.getById(listGuid)
      .items.select(
        "Title",
        "Descripcion",
        "Categoria",
        "FechaPublicacion",
        "Imagen",
        "Usuario/Title",
        "Usuario/ID"
      )
      .expand("Usuario")()

    return news.map((n) => ({
      title: n.Title,
      category: n.Categoria,
      description: n.Descripcion,
      publishedAt: n.FechaPublicacion,
      author: n.Usuario.Title,
      image: n.Imagen.Url,
    }))
  }, [listGuid])

  React.useEffect(() => {
    getNews().then(setNews).catch(console.error)
  }, [getNews])

  interface IDisplayProps {
    type: NewsDisplayType
    news: INews[]
  }
  const Display = ({ type, news }: IDisplayProps): React.ReactElement => {
    switch (type) {
      case NewsDisplayType.list:
        return <DetailsList items={news} />
      case NewsDisplayType.card:
        return (
          <Stack tokens={{ childrenGap: 16 }}>
            {news.map((n) => (
              <DocumentCard
                key={n.title}
                aria-label={n.description}
                type={DocumentCardType.compact}
              >
                <DocumentCardDetails>
                  <DocumentCardTitle title={n.title} />
                  <DocumentCardActivity
                    activity={`Created at ${n.publishedAt}`}
                    people={[{ name: n.author, profileImageSrc: "" }]}
                  />
                </DocumentCardDetails>
              </DocumentCard>
            ))}
          </Stack>
        )
      default:
        return
    }
  }

  return (
    <section>
      <Display type={displayType} news={news} />
    </section>
  )
}
