export class Slug {
  public value: string

  constructor (value: string) {
    this.value = value
  }

  /**
   * Recebe uma string e a normaliza como um slug.
   * 
   * Example: "Um título de exemplo" => "um-titlo-de-exemplo"
   * 
   * @param text {string}
   */
  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD')
      .toLocaleLowerCase() // tudo em letra menusculas
      .trim() // remove todo espaçamento na esquerda e direita
      .replace(/\s+/g, '-') // pegar todo espaçamento e trocar por ifem
      .replace(/[^\w-]+/g, '') // pagar tudo que não são palavras e sebstituir por string vazio
      .replace(/_/g, '-') // pegar anderlane e substituir por ifem
      .replace(/--+/g, '-')
      .replace(/-$/g, '') // Se existe um ifem no final da string, subtituir por um string vazio

    return new Slug(slugText)
  }
}