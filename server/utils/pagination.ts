// pagination 모듈화
async function pagination(page: any, perPage: any, model: any, filter: any) {
  const [total, datas] = await Promise.all([
    model.countDocuments(filter),     // 전체 데이터 수 쿼리
    model.find(filter)
      .skip(perPage * (page - 1)) // perPage * (page - 1)개의 데이터를 생략하고, perPage * (page - 1) + 1번째 데이터부터 출력
      // perPage가 10 이고, page가 4 이면 30개의 데이터 생략, 31 번째 데이터부터 출력.
      .limit(perPage)   // perPage 개수로 제한해서 조회
  ])

  const totalPage = Math.ceil(total / perPage);

  return ({ datas, page, perPage, totalPage });
}

export { pagination };