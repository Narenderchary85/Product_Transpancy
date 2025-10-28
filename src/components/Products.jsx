import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Navbar from './Navbar';
import ProductTransparencyReport from './ProductTransparencyReport';
import { useSimplePdfExport } from '../hooks/usePdfExport';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(null); 

  const { exportToPdf } = useSimplePdfExport();

  const fetchProducts = async () => {
    try {
      const res = await fetch('https://product-transpancy-backend.onrender.com/product/getproducts');
      const data = await res.json();
      
      if (data.success) {
        setProducts(data.products);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const downloadReport = async (productId, productName) => {
    setDownloading(productId);
    setError('');

    try {
      const res = await fetch(`https://product-transpancy-backend.onrender.com/product/getproduct/${productId}`);
      const data = await res.json();
      
      if (data.success) {
        const product = data.product;
        
        await handleGenerateReport(product);
      } else {
        throw new Error('Failed to fetch product data');
      }
    } catch (err) {
      console.error('Download error:', err);
      setError('Error downloading report');
    } finally {
      setDownloading(null);
    }
  };

  const handleGenerateReport = async (product) => {
    try {
      const tempContainer = document.createElement("div");
      document.body.appendChild(tempContainer);

      const root = ReactDOM.createRoot(tempContainer);
      root.render(
        <ProductTransparencyReport
          productData={{
            productName: product.productName,
            category: product.category,
            description: product.description,
            qa: product.qa,
          }}
          transparencyScore={calculateTransparencyScore(product.qa)}
        />
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));
      await exportToPdf(tempContainer, `${product.productName}_transparency_report.pdf`);
      root.unmount();
      document.body.removeChild(tempContainer);

      console.log("Report generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Failed to generate PDF report");
    }
  };

  const calculateTransparencyScore = (qa) => {
    if (!qa || qa.length === 0) return 0;
    
    const baseScore = Math.min(qa.length * 15, 60);
    const qualityBonus = qa.reduce((acc, item) => {
      return acc + Math.min(item.answer.length / 10, 5);
    }, 0);
    
    return Math.min(baseScore + qualityBonus, 100);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-orange-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-orange-50 to-orange-100'>
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-orange-50 to-orange-100'>
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={fetchProducts}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No products found</div>
            <p className="text-gray-400">Start by creating your first product transparency assessment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const transparencyScore = calculateTransparencyScore(product.qa);
              
              return (
                <div key={product._id} className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-lg font-semibold text-lg">
                      {product.productName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">{product.productName}</h3>
                      <p className="text-gray-500 text-sm">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`w-12 h-12 rounded-full ${getScoreColor(transparencyScore)} flex items-center justify-center text-white font-bold text-sm`}>
                      {transparencyScore}%
                    </div>
                  </div>
                </div>

                {product.description && (
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-400 mb-5">
                  <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>

                <button
                  onClick={() => downloadReport(product._id, product.productName)}
                  disabled={downloading === product._id}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm hover:shadow-md"
                >
                  {downloading === product._id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Report
                    </>
                  )}
                </button>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;