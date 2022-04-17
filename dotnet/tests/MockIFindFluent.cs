using System.Linq;
using System;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace tests
{
	public class MockIFindFluent<TEntity, TResult> : IFindFluent<TEntity, TResult>
	{
        private readonly IEnumerable<TEntity> _items;

        public MockIFindFluent(IEnumerable<TEntity> items)
        {
            _items = items ?? Enumerable.Empty<TEntity>();
        }

        public FilterDefinition<TEntity> Filter { get; set; }

        public FindOptions<TEntity, TResult> Options { get; set; }

        public IFindFluent<TEntity, TResult> As<TResult>(MongoDB.Bson.Serialization.IBsonSerializer<TResult> resultSerializer = null)
        {
            throw new NotImplementedException();
        }

        public long Count(CancellationToken cancellationToken = default)
        {
            return _items.Count();
        }

        public Task<long> CountAsync(CancellationToken cancellationToken = default)
        {
            return Task.FromResult<long>(_items.Count());
        }

        public long CountDocuments(CancellationToken cancellationToken = default)
        {
            return _items.Count();
        }

        public Task<long> CountDocumentsAsync(CancellationToken cancellationToken = default)
        {
            return Task.FromResult<long>(_items.Count());
        }

        public IFindFluent<TEntity, TResult> Limit(int? limit)
        {
            var documents = _items
                .Where((document, index) => index < limit);
            return new MockIFindFluent<TEntity, TResult>(documents);
        }

        public IFindFluent<TEntity, TNewProjection> Project<TNewProjection>(ProjectionDefinition<TEntity, TNewProjection> projection)
        {
            throw new NotImplementedException();
        }

        public IFindFluent<TEntity, TResult> Skip(int? skip)
        {
            var documents = _items
                .Where((document, index) => index >= skip);
            return new MockIFindFluent<TEntity, TResult>(documents);
        }

        public IFindFluent<TEntity, TResult> Sort(SortDefinition<TEntity> sort)
        {
            return new MockIFindFluent<TEntity, TResult>(_items);
        }

        public IAsyncCursor<TResult> ToCursor(CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task<IAsyncCursor<TResult>> ToCursorAsync(CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }
    }
}

