// DEBUG: import { b2Assert } from "../Common/b2Settings";
import { b2_maxFloat, b2_maxManifoldPoints } from "../Common/b2Settings";
import { b2Vec2, b2Rot, b2Transform } from "../Common/b2Math";
import { b2ContactFeatureType } from "./b2Collision";
import { b2ManifoldType, b2ClipVertex, b2ClipSegmentToLine } from "./b2Collision";
const b2EdgeSeparation_s_normal1World = new b2Vec2();
const b2EdgeSeparation_s_normal1 = new b2Vec2();
const b2EdgeSeparation_s_v1 = new b2Vec2();
const b2EdgeSeparation_s_v2 = new b2Vec2();
function b2EdgeSeparation(poly1, xf1, edge1, poly2, xf2) {
    // DEBUG: const count1: number = poly1.m_count;
    const vertices1 = poly1.m_vertices;
    const normals1 = poly1.m_normals;
    const count2 = poly2.m_count;
    const vertices2 = poly2.m_vertices;
    // DEBUG: b2Assert(0 <= edge1 && edge1 < count1);
    // Convert normal from poly1's frame into poly2's frame.
    const normal1World = b2Rot.MulRV(xf1.q, normals1[edge1], b2EdgeSeparation_s_normal1World);
    const normal1 = b2Rot.MulTRV(xf2.q, normal1World, b2EdgeSeparation_s_normal1);
    // Find support vertex on poly2 for -normal.
    let index = 0;
    let minDot = b2_maxFloat;
    for (let i = 0; i < count2; ++i) {
        const dot = b2Vec2.DotVV(vertices2[i], normal1);
        if (dot < minDot) {
            minDot = dot;
            index = i;
        }
    }
    const v1 = b2Transform.MulXV(xf1, vertices1[edge1], b2EdgeSeparation_s_v1);
    const v2 = b2Transform.MulXV(xf2, vertices2[index], b2EdgeSeparation_s_v2);
    const separation = b2Vec2.DotVV(b2Vec2.SubVV(v2, v1, b2Vec2.s_t0), normal1World);
    return separation;
}
const b2FindMaxSeparation_s_d = new b2Vec2();
const b2FindMaxSeparation_s_dLocal1 = new b2Vec2();
function b2FindMaxSeparation(edgeIndex, poly1, xf1, poly2, xf2) {
    const count1 = poly1.m_count;
    const normals1 = poly1.m_normals;
    // Vector pointing from the centroid of poly1 to the centroid of poly2.
    const d = b2Vec2.SubVV(b2Transform.MulXV(xf2, poly2.m_centroid, b2Vec2.s_t0), b2Transform.MulXV(xf1, poly1.m_centroid, b2Vec2.s_t1), b2FindMaxSeparation_s_d);
    const dLocal1 = b2Rot.MulTRV(xf1.q, d, b2FindMaxSeparation_s_dLocal1);
    // Find edge normal on poly1 that has the largest projection onto d.
    let edge = 0;
    let maxDot = (-b2_maxFloat);
    for (let i = 0; i < count1; ++i) {
        const dot = b2Vec2.DotVV(normals1[i], dLocal1);
        if (dot > maxDot) {
            maxDot = dot;
            edge = i;
        }
    }
    // Get the separation for the edge normal.
    let s = b2EdgeSeparation(poly1, xf1, edge, poly2, xf2);
    // Check the separation for the previous edge normal.
    const prevEdge = (edge + count1 - 1) % count1;
    const sPrev = b2EdgeSeparation(poly1, xf1, prevEdge, poly2, xf2);
    // Check the separation for the next edge normal.
    const nextEdge = (edge + 1) % count1;
    const sNext = b2EdgeSeparation(poly1, xf1, nextEdge, poly2, xf2);
    // Find the best edge and the search direction.
    let bestEdge = 0;
    let bestSeparation = 0;
    let increment = 0;
    if (sPrev > s && sPrev > sNext) {
        increment = -1;
        bestEdge = prevEdge;
        bestSeparation = sPrev;
    }
    else if (sNext > s) {
        increment = 1;
        bestEdge = nextEdge;
        bestSeparation = sNext;
    }
    else {
        edgeIndex[0] = edge;
        return s;
    }
    // Perform a local search for the best edge normal.
    while (true) {
        if (increment === -1) {
            edge = (bestEdge + count1 - 1) % count1;
        }
        else {
            edge = (bestEdge + 1) % count1;
        }
        s = b2EdgeSeparation(poly1, xf1, edge, poly2, xf2);
        if (s > bestSeparation) {
            bestEdge = edge;
            bestSeparation = s;
        }
        else {
            break;
        }
    }
    edgeIndex[0] = bestEdge;
    return bestSeparation;
}
const b2FindIncidentEdge_s_normal1 = new b2Vec2();
function b2FindIncidentEdge(c, poly1, xf1, edge1, poly2, xf2) {
    // DEBUG: const count1: number = poly1.m_count;
    const normals1 = poly1.m_normals;
    const count2 = poly2.m_count;
    const vertices2 = poly2.m_vertices;
    const normals2 = poly2.m_normals;
    // DEBUG: b2Assert(0 <= edge1 && edge1 < count1);
    // Get the normal of the reference edge in poly2's frame.
    const normal1 = b2Rot.MulTRV(xf2.q, b2Rot.MulRV(xf1.q, normals1[edge1], b2Vec2.s_t0), b2FindIncidentEdge_s_normal1);
    // Find the incident edge on poly2.
    let index = 0;
    let minDot = b2_maxFloat;
    for (let i = 0; i < count2; ++i) {
        const dot = b2Vec2.DotVV(normal1, normals2[i]);
        if (dot < minDot) {
            minDot = dot;
            index = i;
        }
    }
    // Build the clip vertices for the incident edge.
    const i1 = index;
    const i2 = (i1 + 1) % count2;
    const c0 = c[0];
    b2Transform.MulXV(xf2, vertices2[i1], c0.v);
    const cf0 = c0.id.cf;
    cf0.indexA = edge1;
    cf0.indexB = i1;
    cf0.typeA = b2ContactFeatureType.e_face;
    cf0.typeB = b2ContactFeatureType.e_vertex;
    const c1 = c[1];
    b2Transform.MulXV(xf2, vertices2[i2], c1.v);
    const cf1 = c1.id.cf;
    cf1.indexA = edge1;
    cf1.indexB = i2;
    cf1.typeA = b2ContactFeatureType.e_face;
    cf1.typeB = b2ContactFeatureType.e_vertex;
}
const b2CollidePolygons_s_incidentEdge = b2ClipVertex.MakeArray(2);
const b2CollidePolygons_s_clipPoints1 = b2ClipVertex.MakeArray(2);
const b2CollidePolygons_s_clipPoints2 = b2ClipVertex.MakeArray(2);
const b2CollidePolygons_s_edgeA = [0];
const b2CollidePolygons_s_edgeB = [0];
const b2CollidePolygons_s_localTangent = new b2Vec2();
const b2CollidePolygons_s_localNormal = new b2Vec2();
const b2CollidePolygons_s_planePoint = new b2Vec2();
const b2CollidePolygons_s_normal = new b2Vec2();
const b2CollidePolygons_s_tangent = new b2Vec2();
const b2CollidePolygons_s_ntangent = new b2Vec2();
const b2CollidePolygons_s_v11 = new b2Vec2();
const b2CollidePolygons_s_v12 = new b2Vec2();
export function b2CollidePolygons(manifold, polyA, xfA, polyB, xfB) {
    manifold.pointCount = 0;
    const totalRadius = polyA.m_radius + polyB.m_radius;
    const edgeA = b2CollidePolygons_s_edgeA;
    edgeA[0] = 0;
    const separationA = b2FindMaxSeparation(edgeA, polyA, xfA, polyB, xfB);
    if (separationA > totalRadius) {
        return;
    }
    const edgeB = b2CollidePolygons_s_edgeB;
    edgeB[0] = 0;
    const separationB = b2FindMaxSeparation(edgeB, polyB, xfB, polyA, xfA);
    if (separationB > totalRadius) {
        return;
    }
    let poly1; // reference polygon
    let poly2; // incident polygon
    let xf1, xf2;
    let edge1 = 0; // reference edge
    let flip = 0;
    const k_relativeTol = 0.98;
    const k_absoluteTol = 0.001;
    if (separationB > k_relativeTol * separationA + k_absoluteTol) {
        poly1 = polyB;
        poly2 = polyA;
        xf1 = xfB;
        xf2 = xfA;
        edge1 = edgeB[0];
        manifold.type = b2ManifoldType.e_faceB;
        flip = 1;
    }
    else {
        poly1 = polyA;
        poly2 = polyB;
        xf1 = xfA;
        xf2 = xfB;
        edge1 = edgeA[0];
        manifold.type = b2ManifoldType.e_faceA;
        flip = 0;
    }
    const incidentEdge = b2CollidePolygons_s_incidentEdge;
    b2FindIncidentEdge(incidentEdge, poly1, xf1, edge1, poly2, xf2);
    const count1 = poly1.m_count;
    const vertices1 = poly1.m_vertices;
    const iv1 = edge1;
    const iv2 = (edge1 + 1) % count1;
    const local_v11 = vertices1[iv1];
    const local_v12 = vertices1[iv2];
    const localTangent = b2Vec2.SubVV(local_v12, local_v11, b2CollidePolygons_s_localTangent);
    localTangent.Normalize();
    const localNormal = b2Vec2.CrossVOne(localTangent, b2CollidePolygons_s_localNormal);
    const planePoint = b2Vec2.MidVV(local_v11, local_v12, b2CollidePolygons_s_planePoint);
    const tangent = b2Rot.MulRV(xf1.q, localTangent, b2CollidePolygons_s_tangent);
    const normal = b2Vec2.CrossVOne(tangent, b2CollidePolygons_s_normal);
    const v11 = b2Transform.MulXV(xf1, local_v11, b2CollidePolygons_s_v11);
    const v12 = b2Transform.MulXV(xf1, local_v12, b2CollidePolygons_s_v12);
    // Face offset.
    const frontOffset = b2Vec2.DotVV(normal, v11);
    // Side offsets, extended by polytope skin thickness.
    const sideOffset1 = -b2Vec2.DotVV(tangent, v11) + totalRadius;
    const sideOffset2 = b2Vec2.DotVV(tangent, v12) + totalRadius;
    // Clip incident edge against extruded edge1 side edges.
    const clipPoints1 = b2CollidePolygons_s_clipPoints1;
    const clipPoints2 = b2CollidePolygons_s_clipPoints2;
    let np;
    // Clip to box side 1
    const ntangent = b2Vec2.NegV(tangent, b2CollidePolygons_s_ntangent);
    np = b2ClipSegmentToLine(clipPoints1, incidentEdge, ntangent, sideOffset1, iv1);
    if (np < 2) {
        return;
    }
    // Clip to negative box side 1
    np = b2ClipSegmentToLine(clipPoints2, clipPoints1, tangent, sideOffset2, iv2);
    if (np < 2) {
        return;
    }
    // Now clipPoints2 contains the clipped points.
    manifold.localNormal.Copy(localNormal);
    manifold.localPoint.Copy(planePoint);
    let pointCount = 0;
    for (let i = 0; i < b2_maxManifoldPoints; ++i) {
        const cv = clipPoints2[i];
        const separation = b2Vec2.DotVV(normal, cv.v) - frontOffset;
        if (separation <= totalRadius) {
            const cp = manifold.points[pointCount];
            b2Transform.MulTXV(xf2, cv.v, cp.localPoint);
            cp.id.Copy(cv.id);
            if (flip) {
                // Swap features
                const cf = cp.id.cf;
                cp.id.cf.indexA = cf.indexB;
                cp.id.cf.indexB = cf.indexA;
                cp.id.cf.typeA = cf.typeB;
                cp.id.cf.typeB = cf.typeA;
            }
            ++pointCount;
        }
    }
    manifold.pointCount = pointCount;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJDb2xsaWRlUG9seWdvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL0JveDJEL0NvbGxpc2lvbi9iMkNvbGxpZGVQb2x5Z29uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDBEQUEwRDtBQUMxRCxPQUFPLEVBQUUsV0FBVyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDekUsT0FBTyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDOUQsT0FBTyxFQUFFLG9CQUFvQixFQUFvQixNQUFNLGVBQWUsQ0FBQztBQUN2RSxPQUFPLEVBQWMsY0FBYyxFQUFtQixZQUFZLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHL0csTUFBTSwrQkFBK0IsR0FBVyxJQUFJLE1BQU0sRUFBRSxDQUFDO0FBQzdELE1BQU0sMEJBQTBCLEdBQVcsSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUN4RCxNQUFNLHFCQUFxQixHQUFXLElBQUksTUFBTSxFQUFFLENBQUM7QUFDbkQsTUFBTSxxQkFBcUIsR0FBVyxJQUFJLE1BQU0sRUFBRSxDQUFDO0FBQ25ELFNBQVMsZ0JBQWdCLENBQUMsS0FBcUIsRUFBRSxHQUFnQixFQUFFLEtBQWEsRUFBRSxLQUFxQixFQUFFLEdBQWdCO0lBQ3ZILCtDQUErQztJQUMvQyxNQUFNLFNBQVMsR0FBYSxLQUFLLENBQUMsVUFBVSxDQUFDO0lBQzdDLE1BQU0sUUFBUSxHQUFhLEtBQUssQ0FBQyxTQUFTLENBQUM7SUFFM0MsTUFBTSxNQUFNLEdBQVcsS0FBSyxDQUFDLE9BQU8sQ0FBQztJQUNyQyxNQUFNLFNBQVMsR0FBYSxLQUFLLENBQUMsVUFBVSxDQUFDO0lBRTdDLGlEQUFpRDtJQUVqRCx3REFBd0Q7SUFDeEQsTUFBTSxZQUFZLEdBQVcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENB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