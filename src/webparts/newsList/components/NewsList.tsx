import * as React from "react"
import {
  DetailsList,
  Dropdown,
  IDropdownOption,
  SearchBox,
  Stack,
} from "@fluentui/react"

import { getSP } from "../../../pnpjsConfig"
import { INewsListProps, NewsDisplayType } from "./INewsListProps"
import { INews } from "./INews"
import NewsCard from "./NewsCard"

const categoryOptions: IDropdownOption[] = [
  { key: "", text: "Todos" },
  { key: "Sharepoint", text: "Sharepoint" },
  { key: "SPFx", text: "SPFx" },
  { key: "Excel", text: "Excel" },
  { key: "Otros", text: "Otros" },
]

const authorOptions: IDropdownOption[] = [
  { key: "", text: "Todos" },
  { key: "Julen Mendioroz Redin", text: "Julen Mendioroz Redin" },
  { key: "Alex Wilber", text: "Alex Wilber" },
  { key: "Adele Vance", text: "Adele Vance" },
]

const getNewsFromList = async (listGuid: string): Promise<INews[]> => {
  const news = await getSP()
    .web.lists.getById(listGuid)
    .items.select(
      "Title",
      "Descripcion",
      "Categoria",
      "FechaPublicacion",
      "Imagen",
      "Usuario/Title"
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
}

export default function NewsList(props: INewsListProps): React.ReactElement {
  const { listGuid, displayType } = props

  const [news, setNews] = React.useState<INews[]>([])
  const [filteredNews, setFilteredNews] = React.useState<INews[]>([])

  const [search, setSearch] = React.useState<string>("")
  const [category, setCategory] = React.useState<IDropdownOption>()
  const [author, setAuthor] = React.useState<IDropdownOption>()

  React.useEffect(() => {
    getNewsFromList(listGuid)
      .then((news) => {
        setNews(news)
        setFilteredNews(news)
      })
      .catch(console.error)
  }, [listGuid])

  React.useEffect(() => {
    let filtered = news

    if (search) {
      filtered = filtered.filter(({ title, description }) =>
        [title, description].some((v) =>
          v.toLowerCase().includes(search.toLowerCase())
        )
      )
    }

    if (category?.key) {
      filtered = filtered.filter((news) => news.category === category.key)
    }

    if (author?.key) {
      filtered = filtered.filter((news) => news.author === author.key)
    }

    setFilteredNews(filtered)
  }, [search, category?.key, author?.key])

  const handleSearchChange = (
    e?: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearch(e?.target.value ?? "")
  }

  const handleCategoryChange = (_: unknown, item: IDropdownOption): void => {
    setCategory(item)
  }

  const handleAuthorChange = (_: unknown, item: IDropdownOption): void => {
    setAuthor(item)
  }

  return (
    <section>
      <SearchBox value={search} onChange={handleSearchChange} />
      <Dropdown
        placeholder="Seleccione una categoría"
        label="Categoría"
        options={categoryOptions}
        onChange={handleCategoryChange}
        selectedKey={category?.key}
      />
      <Dropdown
        placeholder="Seleccione un autor"
        label="Autor"
        options={authorOptions}
        onChange={handleAuthorChange}
        selectedKey={author?.key}
      />
      {(() => {
        switch (displayType) {
          case NewsDisplayType.list:
            return <DetailsList items={filteredNews} />
          case NewsDisplayType.card:
            return (
              <Stack tokens={{ childrenGap: 16 }}>
                {filteredNews.map((news) => (
                  <NewsCard key={news.title} {...news} />
                ))}
              </Stack>
            )
          default:
            return
        }
      })()}
    </section>
  )
}
