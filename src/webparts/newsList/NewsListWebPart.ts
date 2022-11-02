import * as React from "react"
import * as ReactDom from "react-dom"
import { Version } from "@microsoft/sp-core-library"
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane"
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base"
import { IReadonlyTheme } from "@microsoft/sp-component-base"

import * as strings from "NewsListWebPartStrings"
import NewsList from "./components/NewsList"
import { INewsListProps, NewsDisplayType } from "./components/INewsListProps"

import { getSP } from "../../pnpjsConfig"

export interface INewsListWebPartProps {
  description: string
  displayType: NewsDisplayType
}

export default class NewsListWebPart extends BaseClientSideWebPart<INewsListWebPartProps> {
  private _isDarkTheme: boolean = false
  private _environmentMessage: string = ""

  public render(): void {
    const { description, displayType = NewsDisplayType.list } = this.properties

    const element: React.ReactElement<INewsListProps> = React.createElement(
      NewsList,
      {
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        listGuid: "f5cee590-ce59-4efd-b100-e49698e7616b",
        description,
        displayType,
      }
    )

    ReactDom.render(element, this.domElement)
  }

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage()
    getSP(this.context)
    return super.onInit()
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) {
      // running in Teams
      return this.context.isServedFromLocalhost
        ? strings.AppLocalEnvironmentTeams
        : strings.AppTeamsTabEnvironment
    }

    return this.context.isServedFromLocalhost
      ? strings.AppLocalEnvironmentSharePoint
      : strings.AppSharePointEnvironment
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return
    }

    this._isDarkTheme = !!currentTheme.isInverted
    const { semanticColors } = currentTheme

    if (semanticColors) {
      this.domElement.style.setProperty(
        "--bodyText",
        semanticColors.bodyText || null
      )
      this.domElement.style.setProperty("--link", semanticColors.link || null)
      this.domElement.style.setProperty(
        "--linkHovered",
        semanticColors.linkHovered || null
      )
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement)
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0")
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
                PropertyPaneDropdown("displayType", {
                  label: "Display mode:",
                  disabled: false,
                  options: [
                    { key: NewsDisplayType.list, text: "List" },
                    { key: NewsDisplayType.card, text: "Card" },
                  ],
                }),
              ],
            },
          ],
        },
      ],
    }
  }
}
