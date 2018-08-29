/*
* Copyright (c) 2011 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
// DEBUG: import { b2Assert } from "../Common/b2Settings";
import { b2_pi, b2MakeNumberArray } from "../Common/b2Settings";
import { b2Atan2, b2Vec2 } from "../Common/b2Math";
import { b2Color } from "../Common/b2Draw";
///
export class b2RopeDef {
    constructor() {
        ///
        this.vertices = [];
        ///
        this.count = 0;
        ///
        this.masses = [];
        ///
        this.gravity = new b2Vec2(0, 0);
        ///
        this.damping = 0.1;
        /// Stretching stiffness
        this.k2 = 0.9;
        /// Bending stiffness. Values above 0.5 can make the simulation blow up.
        this.k3 = 0.1;
    }
}
///
export class b2Rope {
    constructor() {
        this.m_count = 0;
        this.m_ps = [];
        this.m_p0s = [];
        this.m_vs = [];
        this.m_ims = [];
        this.m_Ls = [];
        this.m_as = [];
        this.m_gravity = new b2Vec2();
        this.m_damping = 0;
        this.m_k2 = 1;
        this.m_k3 = 0.1;
    }
    GetVertexCount() {
        return this.m_count;
    }
    GetVertices() {
        return this.m_ps;
    }
    ///
    Initialize(def) {
        // DEBUG: b2Assert(def.count >= 3);
        this.m_count = def.count;
        // this.m_ps = (b2Vec2*)b2Alloc(this.m_count * sizeof(b2Vec2));
        this.m_ps = b2Vec2.MakeArray(this.m_count);
        // this.m_p0s = (b2Vec2*)b2Alloc(this.m_count * sizeof(b2Vec2));
        this.m_p0s = b2Vec2.MakeArray(this.m_count);
        // this.m_vs = (b2Vec2*)b2Alloc(this.m_count * sizeof(b2Vec2));
        this.m_vs = b2Vec2.MakeArray(this.m_count);
        // this.m_ims = (float32*)b2Alloc(this.m_count * sizeof(float32));
        this.m_ims = b2MakeNumberArray(this.m_count);
        for (let i = 0; i < this.m_count; ++i) {
            this.m_ps[i].Copy(def.vertices[i]);
            this.m_p0s[i].Copy(def.vertices[i]);
            this.m_vs[i].SetZero();
            const m = def.masses[i];
            if (m > 0) {
                this.m_ims[i] = 1 / m;
            }
            else {
                this.m_ims[i] = 0;
            }
        }
        const count2 = this.m_count - 1;
        const count3 = this.m_count - 2;
        // this.m_Ls = (float32*)be2Alloc(count2 * sizeof(float32));
        this.m_Ls = b2MakeNumberArray(count2);
        // this.m_as = (float32*)b2Alloc(count3 * sizeof(float32));
        this.m_as = b2MakeNumberArray(count3);
        for (let i = 0; i < count2; ++i) {
            const p1 = this.m_ps[i];
            const p2 = this.m_ps[i + 1];
            this.m_Ls[i] = b2Vec2.DistanceVV(p1, p2);
        }
        for (let i = 0; i < count3; ++i) {
            const p1 = this.m_ps[i];
            const p2 = this.m_ps[i + 1];
            const p3 = this.m_ps[i + 2];
            const d1 = b2Vec2.SubVV(p2, p1, b2Vec2.s_t0);
            const d2 = b2Vec2.SubVV(p3, p2, b2Vec2.s_t1);
            const a = b2Vec2.CrossVV(d1, d2);
            const b = b2Vec2.DotVV(d1, d2);
            this.m_as[i] = b2Atan2(a, b);
        }
        this.m_gravity.Copy(def.gravity);
        this.m_damping = def.damping;
        this.m_k2 = def.k2;
        this.m_k3 = def.k3;
    }
    ///
    Step(h, iterations) {
        if (h === 0) {
            return;
        }
        const d = Math.exp(-h * this.m_damping);
        for (let i = 0; i < this.m_count; ++i) {
            this.m_p0s[i].Copy(this.m_ps[i]);
            if (this.m_ims[i] > 0) {
                this.m_vs[i].SelfMulAdd(h, this.m_gravity);
            }
            this.m_vs[i].SelfMul(d);
            this.m_ps[i].SelfMulAdd(h, this.m_vs[i]);
        }
        for (let i = 0; i < iterations; ++i) {
            this.SolveC2();
            this.SolveC3();
            this.SolveC2();
        }
        const inv_h = 1 / h;
        for (let i = 0; i < this.m_count; ++i) {
            b2Vec2.MulSV(inv_h, b2Vec2.SubVV(this.m_ps[i], this.m_p0s[i], b2Vec2.s_t0), this.m_vs[i]);
        }
    }
    SolveC2() {
        const count2 = this.m_count - 1;
        for (let i = 0; i < count2; ++i) {
            const p1 = this.m_ps[i];
            const p2 = this.m_ps[i + 1];
            const d = b2Vec2.SubVV(p2, p1, b2Rope.s_d);
            const L = d.Normalize();
            const im1 = this.m_ims[i];
            const im2 = this.m_ims[i + 1];
            if (im1 + im2 === 0) {
                continue;
            }
            const s1 = im1 / (im1 + im2);
            const s2 = im2 / (im1 + im2);
            p1.SelfMulSub(this.m_k2 * s1 * (this.m_Ls[i] - L), d);
            p2.SelfMulAdd(this.m_k2 * s2 * (this.m_Ls[i] - L), d);
            // this.m_ps[i] = p1;
            // this.m_ps[i + 1] = p2;
        }
    }
    SetAngle(angle) {
        const count3 = this.m_count - 2;
        for (let i = 0; i < count3; ++i) {
            this.m_as[i] = angle;
        }
    }
    SolveC3() {
        const count3 = this.m_count - 2;
        for (let i = 0; i < count3; ++i) {
            const p1 = this.m_ps[i];
            const p2 = this.m_ps[i + 1];
            const p3 = this.m_ps[i + 2];
            const m1 = this.m_ims[i];
            const m2 = this.m_ims[i + 1];
            const m3 = this.m_ims[i + 2];
            const d1 = b2Vec2.SubVV(p2, p1, b2Rope.s_d1);
            const d2 = b2Vec2.SubVV(p3, p2, b2Rope.s_d2);
            const L1sqr = d1.LengthSquared();
            const L2sqr = d2.LengthSquared();
            if (L1sqr * L2sqr === 0) {
                continue;
            }
            const a = b2Vec2.CrossVV(d1, d2);
            const b = b2Vec2.DotVV(d1, d2);
            let angle = b2Atan2(a, b);
            const Jd1 = b2Vec2.MulSV((-1 / L1sqr), d1.SelfSkew(), b2Rope.s_Jd1);
            const Jd2 = b2Vec2.MulSV((1 / L2sqr), d2.SelfSkew(), b2Rope.s_Jd2);
            const J1 = b2Vec2.NegV(Jd1, b2Rope.s_J1);
            const J2 = b2Vec2.SubVV(Jd1, Jd2, b2Rope.s_J2);
            const J3 = Jd2;
            let mass = m1 * b2Vec2.DotVV(J1, J1) + m2 * b2Vec2.DotVV(J2, J2) + m3 * b2Vec2.DotVV(J3, J3);
            if (mass === 0) {
                continue;
            }
            mass = 1 / mass;
            let C = angle - this.m_as[i];
            while (C > b2_pi) {
                angle -= 2 * b2_pi;
                C = angle - this.m_as[i];
            }
            while (C < -b2_pi) {
                angle += 2 * b2_pi;
                C = angle - this.m_as[i];
            }
            const impulse = -this.m_k3 * mass * C;
            p1.SelfMulAdd((m1 * impulse), J1);
            p2.SelfMulAdd((m2 * impulse), J2);
            p3.SelfMulAdd((m3 * impulse), J3);
            // this.m_ps[i] = p1;
            // this.m_ps[i + 1] = p2;
            // this.m_ps[i + 2] = p3;
        }
    }
    Draw(draw) {
        const c = new b2Color(0.4, 0.5, 0.7);
        for (let i = 0; i < this.m_count - 1; ++i) {
            draw.DrawSegment(this.m_ps[i], this.m_ps[i + 1], c);
        }
    }
}
///
b2Rope.s_d = new b2Vec2();
b2Rope.s_d1 = new b2Vec2();
b2Rope.s_d2 = new b2Vec2();
b2Rope.s_Jd1 = new b2Vec2();
b2Rope.s_Jd2 = new b2Vec2();
b2Rope.s_J1 = new b2Vec2();
b2Rope.s_J2 = new b2Vec2();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYjJSb3BlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vQm94MkQvUm9wZS9iMlJvcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7RUFnQkU7QUFFRiwwREFBMEQ7QUFDMUQsT0FBTyxFQUFFLEtBQUssRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDbkQsT0FBTyxFQUFFLE9BQU8sRUFBVSxNQUFNLGtCQUFrQixDQUFDO0FBRW5ELEdBQUc7QUFDSCxNQUFNLE9BQU8sU0FBUztJQUF0QjtRQUNFLEdBQUc7UUFDSSxhQUFRLEdBQWEsRUFBRSxDQUFDO1FBRS9CLEdBQUc7UUFDSSxVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBRXpCLEdBQUc7UUFDSSxXQUFNLEdBQWEsRUFBRSxDQUFDO1FBRTdCLEdBQUc7UUFDYSxZQUFPLEdBQVcsSUFBSSxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRW5ELEdBQUc7UUFDSSxZQUFPLEdBQVcsR0FBRyxDQUFDO1FBRTdCLHdCQUF3QjtRQUNqQixPQUFFLEdBQVcsR0FBRyxDQUFDO1FBRXhCLHdFQUF3RTtRQUNqRSxPQUFFLEdBQVcsR0FBRyxDQUFDO0lBQzFCLENBQUM7Q0FBQTtBQUVELEdBQUc7QUFDSCxNQUFNLE9BQU8sTUFBTTtJQUFuQjtRQUNTLFlBQU8sR0FBVyxDQUFDLENBQUM7UUFDcEIsU0FBSSxHQUFhLEVBQUUsQ0FBQztRQUNwQixVQUFLLEdBQWEsRUFBRSxDQUFDO1FBQ3JCLFNBQUksR0FBYSxFQUFFLENBQUM7UUFFcEIsVUFBSyxHQUFhLEVBQUUsQ0FBQztRQUVyQixTQUFJLEdBQWEsRUFBRSxDQUFDO1FBQ3BCLFNBQUksR0FBYSxFQUFFLENBQUM7UUFFWCxjQUFTLEdBQVcsSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUMxQyxj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