const express = require('express');
const axios = require('axios');
require('dotenv').config(); // .envファイルから環境変数を読み込む
const cors = require("cors")

const app = express();
const port = process.env.PORT || 3001;
; // バックエンドサーバーのポート

app.use(express.json());
app.use(cors());

app.post('/createNotionPage', async (req, res) => {
  try {
    console.log(req.body)
    const { product, asin,StockPriceValue, feedback ,selectedPurpose } = req.body;
    const databaseId = 'c7018c38f98144c0b890da2801fdf7f1'; // NotionデータベースのIDに変更
    const multiSelectArray = selectedPurpose.map((item) => ({
      // id: item.id || null, // Replace with actual id if available
      name: item,
    }));
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD の形式に変換
    
    console.log(product)
    const response = await axios.post(
      `https://api.notion.com/v1/pages`,
      {
        parent: {
          database_id: databaseId,
        },
        properties: {
          商品名: {
            title: [
              {
                text: {
                  content: product,
                },
              },
            ],
          },
          ASIN: {
            rich_text: [
              {
                text: {
                  content: asin,
                },
              },
            ],
          },
          仕入れ金額: {
            rich_text: [
              {
                text: {
                  content: StockPriceValue,
                },
              },
            ],
          },
          感想: {
            rich_text: [
              {
                text: {
                  content: feedback,
                },
              },
            ],
          },
          目的別: {
            multi_select: multiSelectArray
          },
          登録日: {
            date:{
              start:tody,
            }
          }
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
          'Content-Type': 'application/json',
          'Notion-Version':`2021-08-16`
        },
      }
    );

    console.log('Data submitted to Notion:', response.data);
    res.status(200).json({ message: 'Data submitted to Notion',data:response.data });
  } catch (error) {
    console.error('Error submitting data to Notion:', error);
    res.status(500).json({ error: 'Failed to submit data to Notion' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
