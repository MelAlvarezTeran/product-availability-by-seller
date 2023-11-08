/* eslint-disable no-useless-return */
/* eslint-disable react/jsx-key */
/* eslint-disable no-console */
/* eslint-disable eqeqeq */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable array-callback-return */
import React from 'react'
import { useProduct } from 'vtex.product-context'
import { useQuery } from 'react-apollo'

import getStockBySeller from './graphql/getStockBySeller.gql'

interface QueryOpt {
  sku: string | undefined
}
interface QueryData {
  seller: string
  skuId: string
  balance: [StockBalance]
}

interface StockBalance {
  warehouseId: string
  warehouseName: string
  totalQuantity: number
  reservedQuantity: number
  hasUnlimitedQuantity: boolean
  timeToRefill: number
  dateOfSupplyUtc: string
}

function ProductStockQuery() {
  const productContextValue = useProduct()

  // eslint-disable-next-line no-console
  // console.log(productContextValue)

  const { data, loading, error } = useQuery<QueryData, QueryOpt>(
    getStockBySeller,
    {
      variables: {
        sku: productContextValue?.selectedItem?.itemId,
      },
    }
  )

  const datos = data as any

  if (loading) {
    return (
      <div>
        <h3>Disponibilidad por Seller:</h3>
        <p>Buscando... </p>
      </div>
    )
  }

  if (error) {
    // eslint-disable-next-line no-console
    console.log('Ocurrió un Error:', error)
  }

  return (
    <div>
      <h3>Disponibilidad por Seller:</h3>
      {datos.getStockBySeller.map((seller: any) => {
        return (
          <div>
            {seller.balance.map((qty: any) => {
              if (qty.totalQuantity > 0) {
                return <p>Stock en {qty.warehouseName} del Seller {seller.sellerid}: {qty.totalQuantity}</p>
              }

              return
            })}
          </div>
        )
      })}
    </div>
  )
}

export default ProductStockQuery
