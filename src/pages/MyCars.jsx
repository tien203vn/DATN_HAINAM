import { useEffect, useState, useCallback } from 'react'
import BreadCrumb from '../components/BreadCrumb'
import CarList from '../components/my-cars/CarList'
import CustomPagination from '../components/paginations/CustomPagination'
import { getCarsByOwner } from '../shared/apis/carApi'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function MyCars() {
  const [cars, setCars] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(3)
  const [total, setTotal] = useState(1)
  const [sortType, setSortType] = useState('id:desc')
  const [loading, setLoading] = useState(true)
  const [availability, setAvailability] = useState('')

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // Lấy giá trị từ URL khi mount
  useEffect(() => {
    const urlKeyword = queryParams.get('keyword');
    let urlAvailability = '';
    if (urlKeyword === '1') urlAvailability = 'available';
    else if (urlKeyword === '0') urlAvailability = 'unavailable';
    const urlSortType = queryParams.get('sort') || 'id:desc';
    setAvailability(urlAvailability);
    setSortType(urlSortType);
    // eslint-disable-next-line
  }, [location.search]);

  // Khi thay đổi filter/sort thì cập nhật URL
  const handleAvailabilityChange = (e) => {
    const value = e.target.value;
    setAvailability(value);
    if (value === "available") {
      queryParams.set('keyword', '1');
    } else if (value === "unavailable") {
      queryParams.set('keyword', '0');
    } else {
      queryParams.delete('keyword'); // Xóa param khi chọn tất cả xe
    }
    navigate(`?${queryParams.toString()}`);
  };

  const handleSortTypeChange = (e) => {
    const value = e.target.value;
    setSortType(value);
    queryParams.set('sort', value);
    navigate(`?${queryParams.toString()}`);
  };

  const fetchData = useCallback(() => {
    // Xử lý keyword cho API
    let keyword;
    if (availability === "available") keyword = 1;
    else if (availability === "unavailable") keyword = 0;

    // Tách sortType thành sortField và sortDir
    const [sortField, sortDir] = sortType.split(':');

    setLoading(true)
    getCarsByOwner({
      currentPage: currentPage, // Không trừ 1 nữa, gửi trực tiếp currentPage
      pageSize: perPage,
      sortField,
      sortDir,
      ...(keyword !== undefined ? { keyword } : {})
    })
      .then((data) => {
        setCars(data.data)
        const meta = data.meta
        if (meta.totalPages !== total) setTotal(meta.totalPages)
        // Bỏ dòng này để không can thiệp vào currentPage
        // if (meta.currentPage + 1 !== currentPage)
        //   setCurrentPage(meta.currentPage + 1)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [currentPage, perPage, sortType, availability]) // Bỏ total khỏi dependency

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handlePerPageChange = useCallback((e) => {
    const value = parseInt(e.target.value, 10)
    if (value < 1) setPerPage(1)
    else setPerPage(value)
  }, [])

  return (
    <>
      <BreadCrumb
        links={[
          {
            path: '/',
            name: 'Home'
          },
          {
            name: 'My Cars'
          }
        ]}
      />
      <div className="container">
        <h1 className="mb-4">My Cars</h1>
        <div className="row d-flex align-items-center justify-content-between">
          <div className="col-md-6 mb-3 d-flex">
            <Link to="/add-car" className="btn btn-primary">
              Add car
            </Link>
          </div>
          <div className="col-md-6 mb-3 d-flex justify-content-end">
            {/* Select sort */}
            <select
              className="form-select w-content"
              aria-label="Sort cars"
              value={sortType}
              onChange={handleSortTypeChange}
              style={{ width: 180 }}
            >
              <option value="id:desc">Newest to Lastest</option>
              <option value="id:asc">Lastest to Newest</option>
              <option value="basePrice:desc">Price High to Low</option>
              <option value="basePrice:asc">Price Low to High</option>
            </select>
            {/* Select availability bên cạnh */}
            <select
              className="form-select w-content ms-3"
              aria-label="Filter availability"
              value={availability}
              onChange={handleAvailabilityChange}
              style={{ width: 160 }}
            >
              <option value="">Tất cả xe</option>
              <option value="available">Xe có sẵn</option>
              <option value="unavailable">Xe không có sẵn</option>
            </select>
          </div>
        </div>
        <div className="row">
          {loading && (
            <div className="py-5 my-4">
              <LoadingState />
            </div>
          )}
          {cars.length > 0 && !loading && <CarList cars={cars} />}
          {cars.length === 0 && !loading && (
            <div className="py-5 my-4">
              <EmptyState />
            </div>
          )}
        </div>
        <div className="row">
          <div className="col d-flex flex-column flex-md-row justify-content-end align-items-center">
            <CustomPagination
              currentPage={currentPage}
              totalPages={total}
              onPageChange={(page) => setCurrentPage(page)}
            />
            <div className="d-flex align-items-center mb-3 ms-md-2">
              <input
                type="number"
                id="carPerPage"
                className="form-control"
                style={{ width: 80 }}
                value={perPage}
                min={1}
                onChange={handlePerPageChange}
              />
              <label htmlFor="carPerPage" className="ms-2 col-form-label">
                per page
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
